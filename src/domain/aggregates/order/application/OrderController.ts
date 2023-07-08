import { Request, Response } from "express";
import { ParsedQs } from "qs";
import HttpServer from "../../../../application/ports/HttpServer";
import IOrderRepository from "../core/ports/IOrderRepository";
import OrderDTO from "../dto/OrderDTO";
import PaymentService from '../../payment/services/PaymentService';

export default class OrderController{
    private readonly httpServer : HttpServer;
    private readonly repository : IOrderRepository;
    private readonly service : PaymentService;

    constructor(httpServer:HttpServer, repository:IOrderRepository, service:PaymentService){
        this.repository = repository;
        this.httpServer = httpServer;
        this.service = service;
        this.routes();
    }

    async routes(){
        this.httpServer.register('get', '/order', async (req: Request, resp: Response) => {
            return await this.getOrders(req.query, resp);
        });
        this.httpServer.register('post', '/order', async  (req: Request, resp: Response) => {
            return await this.newOrder(req.body, resp);
        });
    }

    async getOrders(queryParams: ParsedQs, response:Response): Promise<any>{
        try {
            let result = null;
            if(queryParams.id){
                result = await this.repository.getOrders(Number(queryParams.id));
            } else {
                result = await this.repository.getOrders();
            }

            const orders = result.map((result: any) => {
                return {
                ...result,
                  order_items: JSON.parse(result.order_items),
                };
              });
            return response.status(200).json(orders);
        } catch (error:any) {
            console.log('Error in query Database', error);
            return response.status(400).json({Error:error.message});
        }   
    }

    async newOrder(body:string, response: Response){
        try{
            //Proceed with the new order
            const parsedJson: OrderDTO = body as unknown as OrderDTO;
            var customerId = parsedJson.customer_id;
            const total = parsedJson.order_total;

            this.repository.beginTransaction();

            //insert order
            if (!customerId){
                customerId = 1; //Customer Default
            }
            const order_id = await this.repository.newOrder(customerId, total);

            //Simulate the payment process
            if ( !this.service.payOrder( order_id, total) ){
                this.repository.rollback();    
                return response.status(400).json({Error: 'Unable to proceed with the order payment! Please, try again later'});
            }

            //insert order_items
            let queryParams = [];
            for (let i in parsedJson.order_items) {
                const item_id = parsedJson.order_items[i].item_id;
                const order_item_qtd = parsedJson.order_items[i].order_item_qtd;
    
                let param = [order_id, item_id, order_item_qtd];
                queryParams.push(param);
            }
            await this.repository.insertOrderItems(queryParams);
            
            //adding order into the order_queue
            const result = await this.repository.addOrderQueue(order_id);

            this.repository.commit();
            return response.status(200).json(result);
        } catch(error:any){
            console.log('Error update customer',error);
            
            this.repository.rollback();
            return response.status(400).json({Error:error.message});
        }
    }
}