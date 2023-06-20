import { Request, Response } from "express";
import HttpServer from "../../../../application/ports/HttpServer";
import Customer from "../core/entities/Customer";
import ICustomerRepository from "../core/ports/ICustomerRepository";
import { ParsedQs } from "qs";

export default class CustomerController{
    private readonly httpServer : HttpServer;
    private readonly repository : ICustomerRepository;

    constructor(httpServer:HttpServer, repository:ICustomerRepository){
        this.repository = repository;
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){
        this.httpServer.register('get', '/customer', async (req: Request, resp: Response) => {
            return await this.getCustomers(req.query);
        });
        this.httpServer.register('post', '/customer', async  (req: Request, resp: Response) => {
            return await this.createCustomer(req.body, resp);
        });
        this.httpServer.register('patch', '/customer', async  (req: Request, resp: Response) => {
            return await this.updateCustomer(req.query, req.body, resp);
        });
        this.httpServer.register('delete', '/customer', async (req: Request, resp: Response) => {
            return await this.deleteCustomer(req.query);
        });
    }

    async getCustomers(queryParams: ParsedQs): Promise<any>{
        try {
            if(queryParams.id){
                return await this.repository.getCustomerById(Number(queryParams.id));
            }
            return await this.repository.getCustomers();
        } catch (error) {
            console.log('Error in query Database', error);
        }   
    }

    async getCustomerById(id:string): Promise<any>{
        try {
            return await this.repository.getCustomerById(Number(id));
        } catch (error) {
            console.log('Error in query Database', error);
        }   
    }

    async createCustomer(body:string, response: Response): Promise<any>{
        try {
            const parsedJson: Customer = body as unknown as Customer;
            if(Object.keys(parsedJson).length === 0){
                return response.status(400).json({ error: 'Missing body.' });
            } else if(!parsedJson.name){
                return response.status(400).json({ error: 'Missing value: name.' });
            }
            const result = await this.repository.createCustomer(
                parsedJson.name,
                parsedJson.email,
                parsedJson.address,
            );
            return result;
        } catch (error) {
            console.log('Error create customer',error);
        }
    }

    async updateCustomer(queryParams: ParsedQs, body:string, response:Response): Promise<any>{
        try {
            const parsedJson: Customer = body as unknown as Customer;
            if(!queryParams.id){
                return response.status(400).json({ error: 'Missing parameters. Please provide id' });
            }else if(!parsedJson.name){
                return response.status(400).json({ error: 'Missing values. Please provide name' });
            }
            const result = await this.repository.updateCustomer(
                Number(queryParams.id),
                parsedJson.name,
                parsedJson.email,
                parsedJson.address
            );
            return result;
        } catch (error) {
            console.log('Error update customer',error);
        }
    }

    async deleteCustomer(queryParams: ParsedQs): Promise<any>{
        if(!queryParams.id){
            throw new Error("Missing parameters. Please provide id");
        }
        try {
            return await this.repository.deleteCustomer(Number(queryParams.id));
        } catch (error) {
            console.log('Error delete customer',error);
        }
    }
}