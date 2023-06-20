import ExpressAdapter from "./application/adapters/ExpressAdapter";
import CustomerController from "./domain/aggregates/userAccess/application/CustomerController";
import PostgreCustomerRepository from "./domain/aggregates/userAccess/infrastructure/PostgreCustomerRepository";

const server = new ExpressAdapter();
const database = new PostgreCustomerRepository();
const service = new CustomerController(server, database);
server.router(CustomerController);
server.listen(3000);