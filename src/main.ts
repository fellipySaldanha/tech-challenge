import ExpressAdapter from "./application/adapters/ExpressAdapter";
import * as dotenv from 'dotenv';

import ProductController from "./domain/aggregates/productMaintenance/application/ProductController";
import MySqlProductRepository from "./domain/aggregates/productMaintenance/infrastructure/MySqlProductRepository";
import CustomerController from "./domain/aggregates/userAccess/application/CustomerController";
import MySQLCustomerRepository from "./domain/aggregates/userAccess/infrastructure/MySQLCustomerRepository";
import OrderController from "./domain/aggregates/order/application/OrderController";
import MySQLOrderRepository from "./domain/aggregates/order/infrastructure/MySQLOrderRepository";
import OrderQueueController from "./domain/aggregates/orderQueue/application/OrderQueueController";
import MySqlOrderQueueRepository from "./domain/aggregates/orderQueue/infrastructure/MySqlOrderQueueRepository";

dotenv.config();

const server = new ExpressAdapter();

const database = new MySQLCustomerRepository();
const database_product = new MySqlProductRepository();
const databaseOrder = new MySQLOrderRepository();
const databaseOrderQueue = new MySqlOrderQueueRepository();

const service = new CustomerController(server, database);
const service1 = new ProductController(server, database_product);
const serviceOrder = new OrderController(server, databaseOrder);
const serviceOrderQueue = new OrderQueueController(server, databaseOrderQueue);

server.router(CustomerController);
server.router(ProductController);
server.router(OrderController);
server.router(OrderQueueController);

server.listen(3000);