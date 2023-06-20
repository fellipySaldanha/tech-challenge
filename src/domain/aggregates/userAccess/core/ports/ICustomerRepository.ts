import Address from "../../../../sharedKernel/valueObjects/Address";
import Email from "../../../../sharedKernel/valueObjects/Email";

export default interface ICustomerRepository {
    createCustomer(name: string, email: Email, address: Address): Promise<any>;
    getCustomers(): Promise<any>;
    getCustomerById(id:number): Promise<any>;
    updateCustomer(id:number, name: string, email: Email, address: Address): Promise<any>;
    deleteCustomer(id:number): Promise<any>;
}
  