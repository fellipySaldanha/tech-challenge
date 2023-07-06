import { Request, Response, query } from "express";
import HttpServer from "../../../../application/ports/HttpServer";
import IOrderQueueRepository from "../core/ports/IOrderQueueRepository";
import { ParsedQs } from "qs";
import { OrderQueueStatus, OrderWaitingTime } from "../core/entities/OrderQueue";

export default class OrderQueueController {

    private readonly httpServer : HttpServer;
    private readonly repository : IOrderQueueRepository;

    constructor(httpServer:HttpServer, repository:IOrderQueueRepository){
        this.repository = repository;
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){
        this.httpServer.register('get', '/orderqueue', async (req: Request, resp: Response) => {
            const result = await this.getOrderQueue(req.query, resp);
        });
        this.httpServer.register('patch', '/orderqueue', async (req: Request, resp: Response) => {
            const result = await this.moveToNextPosition(req.query, resp);
        });
    }

    async getOrderQueue(queryParams: ParsedQs, response: Response){
        try {
            var result;
            if (queryParams.id) {
                result = await this.repository.getOrderQueue(Number(queryParams.id));
            } else {
                result = await this.repository.getOrderQueue();
            }
            
            return response.status(200).json(result);
        } catch (error:any) {
            console.log('Error in query Database', error);
            return response.status(400).json({Error:error.message});
        }   
    }

    async moveToNextPosition(queryParams: ParsedQs, response:Response): Promise<any>{
        if(!queryParams.id){
            return response.status(400).json({ Error: 'Missing parameters. Please provide id' });
        }
        const orderId = Number(queryParams.id);

        try{
            this.repository.beginTransaction();

            const myOrder = await this.repository.getOrderQueueStatus(orderId);
            var status_queue_enum_id = myOrder[0].status_queue_enum_id;
            var waiting_time = myOrder[0].waiting_time;

            //set the status the the next level (see OrderQueueStatus enum): 1: Recebido, 2: Em preparação; 3: Pronto; 4: Finalizado
            if (status_queue_enum_id != OrderQueueStatus.Finalizado){
                status_queue_enum_id++;
                
                if (status_queue_enum_id == OrderQueueStatus.EmPreparacao){
                    waiting_time = OrderWaitingTime.TempoEmPreparacao;
                } else {
                    waiting_time = OrderWaitingTime.TempoPronto;
                }
            } else{
                this.repository.rollback();
                return response.status(200).json({ WARNING: 'Order has already delivered!' });
            }

            await this.repository.updateOrderQueue(orderId, status_queue_enum_id, waiting_time);
            this.repository.commit();

            const result = await this.repository.getOrderQueue(orderId);
            return response.status(200).json(result);
        } catch (error:any) {
            this.repository.rollback();
            
            console.log('Error moving order into the queue',error);
            response.status(400).json({ Error: error.message });
        }
    }
}