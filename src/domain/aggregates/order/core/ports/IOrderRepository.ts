export default interface IOrderRepository {
    getOrders(): Promise<any>;
    getOrderById(id:number): Promise<any>;
}
  