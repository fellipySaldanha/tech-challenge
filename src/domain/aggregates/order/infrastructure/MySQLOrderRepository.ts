import mysql from 'mysql';
import * as dotenv from 'dotenv';
import IOrderRepository from '../core/ports/IOrderRepository';
import MySqlOrderQueueRepository from '../../orderQueue/infrastructure/MySqlOrderQueueRepository';

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
    beginTransaction(): void {
      this.connection.beginTransaction();
    }
    commit(): void {
      this.connection.commit();
    }
    rollback():void {
      this.connection.rollback();
    }

    async getOrders(orderId?: number): Promise<any> {
        const values = [orderId];
        var myQuery = `
            SELECT
                O.id, O.order_date, O.order_total, O.customer_id,
                CUS.customer_name,
                SQE.status_queue AS order_status,
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'item', I.item_name,
                    'qty', OI.order_item_qtd,
                    'price', I.item_price
                  )
                ) AS order_items
            FROM orders O
            LEFT OUTER JOIN customers CUS ON O.customer_id = CUS.id
            LEFT OUTER JOIN order_queue OQ ON OQ.order_id = O.id
            LEFT OUTER JOIN status_queue_enum SQE ON SQE.id = OQ.status_queue_enum_id
            LEFT OUTER JOIN order_item OI ON OI.order_id = O.id 
            LEFT OUTER JOIN itens I ON I.id = OI.item_id`;
        if (orderId){
            myQuery = myQuery + ` WHERE O.id = ?`;
        }
        myQuery = myQuery + ` 
            GROUP BY O.id, order_status
            ORDER BY O.order_date DESC, O.id DESC, order_status DESC`;
        
        return await this.commitDB(myQuery, values);      
    }
  
    private async commitDB(query:string, values:any[]){
        return new Promise((resolve, reject) => {
          this.connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
    }
  
    async newOrder(customerId: number, total: number){
        try{
            const insertQuery = 'INSERT INTO orders (order_date, order_total, customer_id) VALUES (NOW(), ?, ?)';
            const values = [total, customerId];
            const result:any = await this.commitDB(insertQuery, values);
            return result?.insertId;
        } catch (err) {
            console.log('Error inserting a new Order', err);
        }
    }

    async insertOrderItems(items: any){
        try{
            const insertItemsQuery = 'INSERT INTO order_item (order_id, item_id, order_item_qtd) VALUES ?';
            await this.commitDB(insertItemsQuery, [items]);
        } catch (err) {
            console.log('Error inserting Order Items', err);
        }
    }

    async addOrderQueue(orderId: number){
        try{
            let orderQueueRepository = new MySqlOrderQueueRepository(this.connection);
            await orderQueueRepository.add(orderId);
            const result = await orderQueueRepository.getOrderQueue(orderId);
            return result;
        } catch (err) {
            console.log('Error adding a new order into the order queue', err);
        }
    }
  }
