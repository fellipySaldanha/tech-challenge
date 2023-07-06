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

export enum OrderQueueStatus{
    Recebido = 1,
    EmPreparacao = 2,
    Pronto = 3,
    Finalizado = 4,
}

export enum OrderWaitingTime{
    TempoRecebido = 5,
    TempoEmPreparacao = 4,
    TempoPronto = 0,
}