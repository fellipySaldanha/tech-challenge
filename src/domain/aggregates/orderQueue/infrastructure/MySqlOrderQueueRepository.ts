const util = require('util');
import mysql from 'mysql';
import IOrderQueueRepository from '../core/ports/IOrderQueueRepository';

export default class MySqlOrderQueueRepository implements IOrderQueueRepository {

    private client: any
    private connection: any;
 
    constructor(){
         this.client = mysql;
 
         this.connection = this.client.createConnection({
         host: process.env.DB_HOST,
         user: process.env.DB_USER,
         password: process.env.DB_PASSWORD,
         database: process.env.DB_NAME
       });
 
       this.connection.connect()
    }
 
    async getOrderQueue(): Promise<any> {
        
        const myQuery = 
        `SELECT oq.order_id, oq.position, sqe.status_queue 
        FROM order_queue oq
        LEFT OUTER JOIN status_queue_enum sqe ON oq.status_queue_enum_id = sqe.id`;

        const result = await new Promise((resolve, reject) => {
            this.connection.query(myQuery, (error: any, results: unknown) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result;
    }
    
    /*
    async getOrderQueueById(): Promise<any>{

    }
    
    async moveNextPosition(orderId: number): Promise<any> {
        const myQuery = `SELECT position, status_queue_enum_id FROM order_queue WHERE order_id = ?`;;

        const result = await new Promise((resolve, reject) => {
            this.connection.query(myQuery, (error: any, results: unknown) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result
    }*/
}
