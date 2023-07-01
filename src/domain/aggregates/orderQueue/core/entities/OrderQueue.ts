export default class OrderQueue {
    orderQueueId: number;
    orderId: number;
    queuePosition: number
    statusQueueId: number;
    

    constructor(orderQueueId: number, orderId: number, queuePosition: number , statusQueueId: number) {
        this.orderQueueId = orderQueueId;
        this.orderId = orderId;
        this.queuePosition = queuePosition;
        this.statusQueueId = statusQueueId;
    }
}