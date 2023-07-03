
const util = require('util');
import mysql from 'mysql';
import * as dotenv from 'dotenv';
import IProductRepository from '../core/ports/IProductRepository';

export default class MySqlProductRepository implements IProductRepository {

   private client: any
   private connection: any;

   constructor(){
        dotenv.config();
        this.client = mysql;

        this.connection = this.client.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });

      this.connection.connect()
   }

  async getProducts(): Promise<any> {
    const queryPromise = util.promisify(this.connection.query).bind(this.connection);
    try{
       // await this.connection.connect();
        const query = 'SELECT * FROM itens';
        // Executar a consulta SQL
        const results = await queryPromise(query);

        return results
      
    }
    catch(err){
        console.error('Erro ao se conectar com o banco de dados:', err);
    }
       
  }

  async getProductById(itemId : number): Promise<any> {
   // const connection = this.startConnection();

    const queryPromise = util.promisify(this.connection.query).bind(this.connection);
    try{
      //  await this.connection.connect();
        const query = 'SELECT * FROM itens where id = ? ';
        const queryParams = [itemId];

        // Executar a consulta SQL

        const results = await queryPromise(query,queryParams);

        return results
      
    }
    catch(err){
        console.error('Erro ao se conectar com o banco de dados:', err);
    }
    
    
  }
  async getProductByCategory(itemId : number): Promise<any> {

    const queryPromise = util.promisify(this.connection.query).bind(this.connection);
    try{
       // await this.connection.connect();
        const query = 'SELECT * FROM itens where item_type_id = ? ';
        const queryParams = [itemId];

        // Executar a consulta SQL

        const results = await queryPromise(query,queryParams);

        return results
      
    }
    catch(err){
        console.error('Erro ao se conectar com o banco de dados:', err);
    }
    
    
  }
  async createProduct(itemType: number, itemName: string,itemPrice: number,itemDescription:string,itemImgUrl:string ): Promise<any>{

    const queryPromise = util.promisify(this.connection.query).bind(this.connection);
    try{
  
        const query = 'INSERT INTO itens (item_type_id,item_name,item_price,item_description,item_img_url) VALUES (?, ?, ?, ?, ?) ';
        const queryParams = [itemType,itemName,itemPrice,itemDescription,itemImgUrl];

        // Executar a consulta SQL
        const results = await queryPromise(query,queryParams);

        return results
      
    }
    catch(err){
        console.error('Erro ao se conectar com o banco de dados:', err);
    }
    
  }

  async updateProduct(itemId: number, itemName: string, itemPrice: number , itemType: number , itemDescription:string,itemImgUrl:string): Promise<any>{
      //const connection = this.startConnection();

      const queryPromise = util.promisify(this.connection.query).bind(this.connection);
      try{
          const query = 'UPDATE itens SET item_type_id = ?,item_name = ?,item_price = ? , item_description = ?, item_img_url = ? WHERE id = ?';
          const queryParams = [itemType,itemName,itemPrice,itemDescription,itemImgUrl,itemId];

          // Executar a consulta SQL
          const results = await queryPromise(query,queryParams);

          return results
        
      }
      catch(err){
          console.error('Erro ao se conectar com o banco de dados:', err);
      }
      
  }

  async deleteProduct(id:number): Promise<any>{

    if(!id){
      throw new Error("Missing parameters. Please provide product id");
    }
    try {
        const queryPromise = util.promisify(this.connection.query).bind(this.connection);
        const query = `DELETE FROM itens WHERE id = ?`;
        const queryParams = [id];
        const result = await queryPromise(query, queryParams);
        //console.log(result);
        return result;
    } catch (error) {
        console.log('ERROR delete product id', error);
    } 
  }


  }
   
