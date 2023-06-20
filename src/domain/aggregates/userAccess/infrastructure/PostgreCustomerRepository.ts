// src/adapters/MySQLUserRepository.ts
import { Pool } from 'pg';
import ICustomerRepository from '../core/ports/ICustomerRepository';
import Address from '../../../sharedKernel/valueObjects/Address';
import Email from '../../../sharedKernel/valueObjects/Email';

export default class PostgreCustomerRepository implements ICustomerRepository {
    private client:any;

    constructor(){
        this.client = new Pool({
            
          });
    }
    
    async createCustomer(name: string, email: Email, address: Address): Promise<void> {
        const connection = await this.client.connect();
        try {
            const insertQuery = `
            INSERT INTO customers (name, email, address)
            VALUES ($1, $2, $3) RETURNING *
            `;
            const values = [name, email, address]; // The values to be inserted
            const result = await connection.query(insertQuery, values);
            return result.rows;
        } catch(error){
            console.log('ERROR create customers', error);
        } finally {
            await connection.release();
        }
    }

    async getCustomers(): Promise<any> {
        const connection = await this.client.connect();
        try {
            const result = await connection.query('SELECT * FROM customers');
            return result.rows;
        } catch(error){
            console.log('Error get customers', error);
        } finally {
            await connection.release();
        }
    }

    async getCustomerById(id:number): Promise<any> {
        if(!id){
            throw new Error("Missing parameters. Please provide id");
        }
        const connection = await this.client.connect();
        try {
            const selectQuery = `SELECT * FROM customers WHERE id = $1`;
            const values = [id];
            const result = await connection.query(selectQuery, values);
            return result.rows;
        } catch (error) {
            console.log('Error get customer', error);
        } finally {
            await connection.release();
        }
    }

    async updateCustomer(id:number, name: string, email: Email, address: Address): Promise<any> {
        if(!id || !name){
            throw new Error("Missing parameters.");
        }
        const connection = await this.client.connect();
        try {
            const updateQuery = `
            UPDATE customers
            SET name = $2, email = $3, address = $4
            WHERE id = $1 RETURNING *
            `;
            const values = [id, name, email, address];
            const result = await connection.query(updateQuery, values);
            return result.rows;
        } catch (error) {
            console.error('Error updating customer:', error);
        } finally {
            await connection.release();
        }
    }

    async deleteCustomer(id:number): Promise<any> {
        if(!id){
            throw new Error("Missing parameters. Please provide id");
        }
        const connection = await this.client.connect();
        try {
            const selectQuery = `DELETE FROM customers WHERE id = $1 RETURNING *`;
            const values = [id];
            const result = await connection.query(selectQuery, values);
            console.log(result);
            return result.rows;
        } catch (error) {
            console.log('ERROR delete customer', error);
        } finally {
            await connection.release();
        }
    }
}
