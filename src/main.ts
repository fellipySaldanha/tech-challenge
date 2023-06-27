import ExpressAdapter from "./application/adapters/ExpressAdapter";
import CustomerController from "./domain/aggregates/userAccess/application/CustomerController";
import MySQLCustomerRepository from "./domain/aggregates/userAccess/infrastructure/MySQLCustomerRepository";

const server = new ExpressAdapter();
const database = new MySQLCustomerRepository();
const service = new CustomerController(server, database);
server.router(CustomerController);
server.listen(3000);