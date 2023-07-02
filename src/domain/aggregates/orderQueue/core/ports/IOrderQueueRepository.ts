export default interface IOrderQueueRepository {  
    getOrderQueue(orderId?: number): Promise<any>;
    getOrderQueuePosition(orderId: number): Promise<any>;
    updateOrderQueue(orderId: number, position: number, status_queue_enum_id: number): Promise<any>;
}