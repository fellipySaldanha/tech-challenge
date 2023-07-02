import { Request, Response, query } from "express";
import HttpServer from "../../../../application/ports/HttpServer";
import IOrderQueueRepository from "../core/ports/IOrderQueueRepository";
//import OrderQueue from "../core/entities/OrderQueue";
import { ParsedQs } from "qs";

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
            //const result = await this.moveToNextPosition(req.query, req.body, resp);
            const result = await this.moveToNextPosition(req.query, resp);
        });
    }

    async getOrderQueue(queryParams: ParsedQs, response: Response): Promise<any>{
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

        //TODO: BEGIN TRANS

        try{
            const myOrder = await this.repository.getOrderQueuePosition(orderId);
            var position = myOrder[0].position;
            var status_queue_enum_id = myOrder[0].status_queue_enum_id;

            //adjust position into the queue
            if (position > 1){
                position--;
            }
            
            //set the status the the next level: 1: Recebido, 2: Em preparação; 3: Pronto; 4: Finalizado
            if (status_queue_enum_id < 4){
                status_queue_enum_id++;
            }

            await this.repository.updateOrderQueue(orderId, position, status_queue_enum_id);
            
            //TODO: COMMIT TRANS
            
            const result = await this.repository.getOrderQueue(orderId);
            return response.status(200).json(result);
        } catch (error:any) {
            //TODO: ROLLBACK
            
            console.log('Error moving order into the queue',error);
            response.status(400).json({ Error: error.message });
        }
    }
}