import { Request, Response } from "express";
import HttpServer from "../../../../application/ports/HttpServer";
import ICustomerRepository from "../core/ports/ICustomerRepository";
import { ParsedQs } from "qs";
import CustomerDTO from "../dto/CustomerDTO";
import Email from '../../../sharedKernel/valueObjects/Email';
import CPF from '../../../sharedKernel/valueObjects/CPF';

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
            return await this.getCustomers(req.query, resp);
        });
        this.httpServer.register('post', '/customer', async  (req: Request, resp: Response) => {
            return await this.createCustomer(req.body, resp);
        });
        this.httpServer.register('patch', '/customer', async  (req: Request, resp: Response) => {
            return await this.updateCustomer(req.query, req.body, resp);
        });
        this.httpServer.register('delete', '/customer', async (req: Request, resp: Response) => {
            return await this.deleteCustomer(req.query, resp);
        });
    }

    async getCustomers(queryParams: ParsedQs, response:Response): Promise<any>{
        try {
            if(queryParams.id){
                const result = await this.repository.getCustomerById(Number(queryParams.id));
                return response.status(200).json(result);
            }
            if(queryParams.cpf){
                const result = await this.repository.getCustomerByCPF(Number(queryParams.cpf));
                return response.status(200).json(result);
            }
            const result = await this.repository.getCustomers();
            return response.status(200).json(result);
        } catch (error:any) {
            console.log('Error in query Database', error);
            return response.status(400).json({Error:error.message});
        }   
    }

    async createCustomer(body:string, response: Response): Promise<any>{
        try {
            const parsedJson: CustomerDTO = body as unknown as CustomerDTO;
            const cpf = new CPF(parsedJson.cpf);
            const email = new Email(parsedJson.email);
            const result = await this.repository.createCustomer(
                parsedJson.name,
                email.getEmail(),
                cpf.getCPF(),
                parsedJson.isActive
            );
            return response.status(200).json(result);;
        } catch (error:any) {
            console.log('Error create customer',error);
            return response.status(400).json({Error:error.message});
        }
    }

    async updateCustomer(queryParams: ParsedQs, body:string, response:Response): Promise<any>{
        try {
            const parsedJson: CustomerDTO = body as unknown as CustomerDTO;
            const cpf = new CPF(parsedJson.cpf);
            const email = new Email(parsedJson.email);
            if(!queryParams.id){
                return response.status(400).json({ Error: 'Missing parameters. Please provide id' });
            }
            const result = await this.repository.updateCustomer(
                Number(queryParams.id),
                parsedJson.name,
                email.getEmail(),
                cpf.getCPF(),
                parsedJson.isActive
            );
            return response.status(200).json(result);
        } catch (error:any) {
            console.log('Error update customer',error);
            return response.status(400).json({Error:error.message});
        }
    }

    async deleteCustomer(queryParams: ParsedQs, response:Response): Promise<any>{
        if(!queryParams.id){
            return response.status(400).json({ Error: 'Missing parameters. Please provide id' });
        }
        try {
            const result = await this.repository.deleteCustomer(Number(queryParams.id));
            if(result?.affectedRows > 0){
                response.status(200).json({Success:`Row with Id ${queryParams.id} deleted`});
            } else {
                response.status(200).json({Success:'No rows were deleted.'});
            }
        } catch (error:any) {
            console.log('Error delete customer',error);
            return response.status(400).json({ Error: error.message });
        }
    }
}