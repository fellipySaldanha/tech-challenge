import { Request, Response } from "express";
import HttpServer from "../../../../application/ports/HttpServer";
import IOrderRepository from "../core/ports/IOrderRepository";
import { ParsedQs } from "qs";

export default class OrderController{
    private readonly httpServer : HttpServer;
    private readonly repository : IOrderRepository;

    constructor(httpServer:HttpServer, repository:IOrderRepository){
        this.repository = repository;
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){
        this.httpServer.register('get', '/order', async (req: Request, resp: Response) => {
            return await this.getOrders(req.query, resp);
        });
    }

    async getOrders(queryParams: ParsedQs, response:Response): Promise<any>{
        try {
            if(queryParams.id){
                const result = await this.repository.getOrderById(Number(queryParams.id));
                return response.status(200).json(result);
            }
            const result = await this.repository.getOrders();
            return response.status(200).json(result);
        } catch (error:any) {
            console.log('Error in query Database', error);
            return response.status(400).json({Error:error.message});
        }   
    }
}