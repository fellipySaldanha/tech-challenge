//const util = require('util');
import mysql from 'mysql';
import IOrderQueueRepository from '../core/ports/IOrderQueueRepository';

export default class MySqlOrderQueueRepository implements IOrderQueueRepository {
    private connection:mysql.Connection;

    constructor(){
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        this.connection.connect();
    }

    async getOrderQueue(orderId?:number): Promise<any> {
        
        const values = [orderId];
        var myQuery = `
            SELECT oq.order_id, oq.position, sqe.status_queue 
            FROM order_queue oq
            LEFT OUTER JOIN status_queue_enum sqe ON oq.status_queue_enum_id = sqe.id`;
        if (orderId){
            myQuery = myQuery + ` WHERE oq.order_id = ?`;

        }

        const result = await new Promise((resolve, reject) => {
            this.connection.query(myQuery, values, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result;
    }
    
    
    async getOrderQueuePosition(orderId: number): Promise<any>{
        const myQuery = `SELECT position, status_queue_enum_id FROM order_queue WHERE order_id = ?`;
        const values = [orderId];
                
        const result = await new Promise((resolve, reject) => {
            this.connection.query(myQuery, values, (error: any, results: unknown) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result;
    }

    async updateOrderQueue(orderId: number, position: number, status_queue_enum_id: number): Promise<any>{
        const update = `UPDATE order_queue SET position = ?, status_queue_enum_id = ? WHERE id = ?`;
        const values = [position, status_queue_enum_id, orderId];

        const result = await new Promise((resolve, reject) => {
            this.connection.query(update, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        return result;
    }
}
