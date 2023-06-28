import ExpressAdapter from "./application/adapters/ExpressAdapter";
import ProductController from "./domain/aggregates/productMaintenance/application/ProductController";
import MySqlProductRepository from "./domain/aggregates/productMaintenance/infrastructure/MySqlProductRepository";
import CustomerController from "./domain/aggregates/userAccess/application/CustomerController";
import MySQLCustomerRepository from "./domain/aggregates/userAccess/infrastructure/MySQLCustomerRepository";

const server = new ExpressAdapter();
const database = new MySQLCustomerRepository();
const database_product = new MySqlProductRepository();

const service = new CustomerController(server, database);
const service1 = new ProductController(server, database_product);

server.router(CustomerController);
server.router(ProductController);
server.listen(3000);