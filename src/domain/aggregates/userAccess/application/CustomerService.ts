import HttpServer from '../../../../application/ports/HttpServer';
import Customer from '../core/entities/Customer';

export default class CustomerService{
    private readonly httpServer : HttpServer;
    private readonly baseUrl : String;

    constructor(httpServer:HttpServer, baseUrl:String){
        this.httpServer = httpServer;
        this.baseUrl = baseUrl;
        this.routes();
    }

    async routes(){
        await this.httpServer.register('get', '/customer', this.getCustomers);
        await this.httpServer.register('get', '/customer/:id', this.getCustomers);
    }

    async getCustomers(): Promise<any>{
        return Customer.createMock();
    }
}