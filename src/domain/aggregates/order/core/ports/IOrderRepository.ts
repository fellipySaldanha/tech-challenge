export default interface IOrderRepository {
    getOrders(orderId?: number): Promise<any>
    newOrder(customerId: number, total: number): any;
    insertOrderItems(items: any): any;
    addOrderQueue(orderId: number): any;
    beginTransaction(): void;
    commit(): void;
    rollback(): void;
}  