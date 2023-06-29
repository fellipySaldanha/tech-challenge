import mysql from 'mysql';
import * as dotenv from 'dotenv';
import IOrderRepository from '../core/ports/IOrderRepository';

export default class MySQLOrderRepository implements IOrderRepository {
    private connection:mysql.Connection;

    constructor(){
        dotenv.config();
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        this.connection.connect();
    }
    
    async getOrders(): Promise<any> {
        const result = await new Promise((resolve, reject) => {
            this.connection.query('SELECT orders.*, customers.customer_name FROM orders JOIN customers ON orders.customer_id = customers.id;', (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result;
    }

    async getOrderById(id:number): Promise<any> {
        const selectQuery = `SELECT orders.*, customers.customer_name FROM orders JOIN customers ON orders.customer_id = customers.id WHERE orders.id = ?;`;
        const values = [id];
        return await this.commitDB(selectQuery,values);
    }

    private async commitDB(query:string, values:any[], id?:number){
        return new Promise((resolve, reject) => {
            this.connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                }
                if(id){
                    results = this.getOrderById(id);
                }
                resolve(results[0]);
            });
        });
    }
}
