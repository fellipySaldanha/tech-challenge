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
            this.connection.query(`SELECT
            orders.*,
            customers.customer_name,
            status_queue_enum.status_queue AS order_status,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'item', itens.item_name,
                'qty', order_item.order_item_qtd,
                'price', itens.item_price
              )
            ) AS order_items
          FROM
            orders
            INNER JOIN status_queue_enum ON orders.id = status_queue_enum.id
            LEFT JOIN order_item ON orders.id = order_item.order_id
            LEFT JOIN itens ON order_item.item_id = itens.id
            LEFT JOIN item_type_enum ON itens.item_type_id = item_type_enum.id
            LEFT JOIN customers ON orders.customer_id = customers.id
            LEFT JOIN (
              SELECT order_id
              FROM order_queue
              GROUP BY order_id
            ) AS order_queue ON orders.id = order_queue.order_id
          GROUP BY
            orders.id, customers.customer_name, status_queue_enum.status_queue;`, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result;
    }

    async getOrderById(id:number): Promise<any> {
        const selectQuery = `SELECT
        orders.*,
        customers.customer_name,
        status_queue_enum.status_queue AS order_status,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'item', itens.item_name,
            'qty', order_item.order_item_qtd,
            'price', itens.item_price
          )
        ) AS order_items
      FROM
        orders
        INNER JOIN status_queue_enum ON orders.id = status_queue_enum.id
        LEFT JOIN order_item ON orders.id = order_item.order_id
        LEFT JOIN itens ON order_item.item_id = itens.id
        LEFT JOIN item_type_enum ON itens.item_type_id = item_type_enum.id
        LEFT JOIN customers ON orders.customer_id = customers.id
        LEFT JOIN (
          SELECT order_id
          FROM order_queue
          GROUP BY order_id
        ) AS order_queue ON orders.id = order_queue.order_id
      WHERE
        orders.id = ?
      GROUP BY
        orders.id, customers.customer_name, status_queue_enum.status_queue;`;
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
