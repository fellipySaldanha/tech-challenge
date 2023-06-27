export default interface ICustomerRepository {
    createCustomer(name: string, email: string, cpf: string, active: boolean): Promise<any>;
    getCustomers(): Promise<any>;
    getCustomerById(id:number): Promise<any>;
    getCustomerByCPF(cpf:number): Promise<any>;
    updateCustomer(id:number, name: string, email: string, cpf: string, active: boolean): Promise<any>;
    deleteCustomer(id:number): Promise<any>;
}
  