import mysql from 'mysql';
import IOrderQueueRepository from '../core/ports/IOrderQueueRepository';
import { OrderQueueStatus, OrderWaitingTime } from '../core/entities/OrderQueue';

export default class MySqlOrderQueueRepository implements IOrderQueueRepository {
    private connection:mysql.Connection;

    constructor(conn?: mysql.Connection){
        if(conn) {
            this.connection = conn;
        } else {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            this.connection.connect();
        }    
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

    async getOrderQueue(orderId?:number) {
        const values = [orderId];
        var myQuery = `
            SELECT OQ.order_id, SQE.status_queue , OQ.waiting_time 
            FROM order_queue OQ
            LEFT OUTER JOIN orders O ON OQ.order_id = O.id
            LEFT OUTER JOIN status_queue_enum SQE ON OQ.status_queue_enum_id = SQE.id`;
        if (orderId){
            myQuery = myQuery + ` WHERE OQ.order_id = ?`;
        } else{
            myQuery = myQuery + ` WHERE OQ.status_queue_enum_id < 4`; //Order in status = FINALIZADO should not appear on the client queue
        }
        myQuery = myQuery + ` ORDER BY OQ.status_queue_enum_id DESC, O.order_date ASC`;

        const result = await this.commitDB(myQuery, values);
        return result;
    }
    
    
    async getOrderQueueStatus(orderId: number){
        const myQuery = `SELECT status_queue_enum_id, waiting_time FROM order_queue WHERE order_id = ?`;
        const values = [orderId];
        const result = await this.commitDB(myQuery, values);
        return result;
    }

    async updateOrderQueue(orderId: number, status_queue_enum_id: number, waiting_time: number){
        const format_time = this.formatWaitingTime(waiting_time);
        const update = `UPDATE order_queue SET status_queue_enum_id = ?, waiting_time = TIME( ? ) WHERE order_id = ?`;
        const values = [status_queue_enum_id, format_time, orderId];
        const result = await this.commitDB(update, values);
        return result;
    }

    async add(orderId: number){
        const format_time = this.formatWaitingTime(OrderWaitingTime.TempoRecebido);
        const insertQuery = 'INSERT INTO order_queue (order_id, status_queue_enum_id, waiting_time) VALUES (?, ?, TIME( ? ))';
        const values = [orderId, OrderQueueStatus.Recebido, format_time];
        const result = await this.commitDB(insertQuery, values);
        return result;
    }

    private formatWaitingTime(waiting_time: number): string {
        const format_time = '00:0' + waiting_time.toString() + ':00';
        return format_time;
    }
}
