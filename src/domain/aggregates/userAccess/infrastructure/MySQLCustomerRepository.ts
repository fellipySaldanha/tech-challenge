import mysql from 'mysql';
import ICustomerRepository from '../core/ports/ICustomerRepository';

export default class MySQLCustomerRepository implements ICustomerRepository {
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
    
    async createCustomer(name: string, email: string, cpf: string, active: boolean): Promise<any> {
        const insertQuery = 'INSERT INTO customers (customer_name, customer_email, customer_cpf, is_active) VALUES (?, ?, ?, ?)';
        const values = [name, email, cpf, active];
        const result:any = await this.commitDB(insertQuery,values);
        return await this.getCustomerById(result?.insertId);
    }

    async getCustomers(): Promise<any> {
        const result = await new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM customers', (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(results);
            });
        });
        return result;
    }

    async getCustomerById(id:number): Promise<any> {
        const selectQuery = `SELECT * FROM customers WHERE id = ?`;
        const values = [id];
        return await this.commitDB(selectQuery,values);
    }

    async getCustomerByCPF(cpf: number): Promise<any> {
        const selectQuery = `SELECT * FROM customers WHERE customer_cpf = ?`;
        const values = [cpf];
        return await this.commitDB(selectQuery,values);
    }

    async updateCustomer(id:number, name: string, email: string, cpf: string, active: boolean): Promise<any> {
        const updateQuery = `
                UPDATE customers
                SET customer_name = ?, customer_email = ?, customer_cpf = ?, is_active = ?
                WHERE id = ?
            `;
        const values = [name, email, cpf, active,id];
        return await this.commitDB(updateQuery,values,id);
    }

    async deleteCustomer(id:number): Promise<any> {
        const deleteQuery = 'DELETE FROM customers WHERE id = ?';
        const values = [id];
        return await this.commitDB(deleteQuery,values);
    }

    private async commitDB(query:string, values:any[], id?:number){
        return new Promise((resolve, reject) => {
            this.connection.query(query, values, (error, results) => {
                if (error) {
                    reject(error);
                }
                if(id){
                    results = this.getCustomerById(id);
                }
                resolve(results);
            });
        });
    }
}
