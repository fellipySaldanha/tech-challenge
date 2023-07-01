import { Request, Response } from "express";
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
        /*
        this.httpServer.register('patch', '/orderqueue', async (req: Request, resp: Response) => {
            const result = await this.getOrderQueue(req.query, resp);
        });*/
    }

    async getOrderQueue(queryParams: ParsedQs, response: Response): Promise<any>{
        try {
            const result = await this.repository.getOrderQueue()
            return response.status(200).json(result);
        } catch (error:any) {
            console.log('Error in query Database', error);
            return response.status(400).json({Error:error.message});
        }   
    }
}