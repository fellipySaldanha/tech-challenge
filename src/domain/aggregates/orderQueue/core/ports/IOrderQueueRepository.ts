export default interface IOrderQueueRepository {  
    getOrderQueue(): Promise<any>;
    //getOrderQueueById(): Promise<any>;
    //moveNextPosition(orderId: number): Promise<any>;
}