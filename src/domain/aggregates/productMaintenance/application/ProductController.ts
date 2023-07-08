import { Request, Response } from "express";
import HttpServer from "../../../../application/ports/HttpServer";
import IProductRepository from "../core/ports/IProductRepository";
import { ParsedQs } from "qs";
import Product from "../core/entities/Product";

export default class ProductController{
  
    private readonly httpServer : HttpServer;
    private readonly repository : IProductRepository;

    constructor(httpServer:HttpServer, repository:IProductRepository){
        this.repository = repository;
        this.httpServer = httpServer;
        this.routes();
    }

    async routes(){
        this.httpServer.register('get', '/product', async (req: Request, resp: Response) => {
            const result = await this.getProducts(req.query);;
            return resp.status(200).json(result);
        });
        this.httpServer.register('get', '/product/findbycategory', async  (req: Request, resp: Response) => {
            const result = await this.getProductsByCategory(req.query);
            return resp.status(200).json(result);
        });
        this.httpServer.register('post', '/product', async  (req: Request, resp: Response) => {
            const result = await this.createProduct(req.body, resp);
            return resp.status(200).json(result);
        });  
        this.httpServer.register('patch', '/product', async  (req: Request, resp: Response) => {
            const result = await this.updateProduct(req.query, req.body, resp);
            return resp.status(200).json(result);
        });
        this.httpServer.register('delete', '/product', async (req: Request, resp: Response) => {
            const result =  await this.deleteProduct(req.query);
            return resp.status(200).json(result);
        });
    }

    async getProducts(queryParams: ParsedQs): Promise<any>{
        try {

            if(queryParams.id){
                return await this.repository.getProductById(Number(queryParams.id));
            }  
            return await this.repository.getProducts()
          
        } catch (error) {
            console.log('Error in query Database', error);
        }   
    }

    async getProductsByCategory(queryParams: ParsedQs): Promise<any>{
        try {
            if(queryParams.category){
                return await this.repository.getProductByCategory(Number(queryParams.category));
            }     
            return await this.repository.getProducts()
        } catch (error) {
            console.log('Error in query Database', error);
        }   
    }

    async createProduct(body:string, response: Response){
        const parsedJson: Product = body as unknown as Product;
        if(Object.keys(parsedJson).length === 0){
            return response.status(400).json({ error: 'Missing body.' });
        } else if(!parsedJson.itemName){
            return response.status(400).json({ error: 'Missing value: itemName.' });
        }
        else if(!parsedJson.itemPrice){
            return response.status(400).json({ error: 'Missing value: itemPrice.' });
        }
        else if(!parsedJson.itemType){
            return response.status(400).json({ error: 'Missing value: itemType.' });
        }
        
        try {
            const result = await this.repository.createProduct(
                parsedJson.itemType,
                parsedJson.itemName,
                parsedJson.itemPrice,
                parsedJson.itemDescription,
                parsedJson.itemImgUrl
            )
               
            return  { id:result.insertId , msg: "Product inserted successfully"};
        }catch(err){
            console.log('Error in query Database', err);
        }
        

    }

    async updateProduct(queryParams: ParsedQs, body:string, response: Response ){
        const parsedJson: Product = body as unknown as Product;

        if(!queryParams.id){
            return response.status(400).json({ error: 'Missing parameters. Please provide id' });
        }
        if(Object.keys(parsedJson).length === 0){
            return response.status(400).json({ error: 'Missing body.' });
        } else if(!parsedJson.itemName){
            return response.status(400).json({ error: 'Missing value: itemName.' });
        }
        else if(!parsedJson.itemPrice){
            return response.status(400).json({ error: 'Missing value: itemPrice.' });
        }
        else if(!parsedJson.itemType){
            return response.status(400).json({ error: 'Missing value: itemType.' });
        }
        
        try {
            const result = await this.repository.updateProduct(
                Number(queryParams.id),
                parsedJson.itemName,
                parsedJson.itemPrice,
                parsedJson.itemType,
                parsedJson.itemDescription,
                parsedJson.itemImgUrl
                
            )
            return result;
        }catch(err){
            console.log('Error in update product', err);
        }
    }

    async deleteProduct(queryParams: ParsedQs): Promise<any>{
        if(!queryParams.id){
            throw new Error("Missing parameters. Please provide the product id");
        }
        try {
            const result = await this.repository.deleteProduct(Number(queryParams.id));
            return { msg : "Product deleted successfully" , result: result}
        
        } catch (error) {
            console.log('Error delete product',error);
        }
    }
}