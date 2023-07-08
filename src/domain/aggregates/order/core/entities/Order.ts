export default class Order {
    id?: number;
    order_date: Date;
    order_total: number;
    customer_id: string;

    constructor(order_date: Date, order_total: number, customer_id: string, orderId?: number) {
        this.id = orderId;
        this.order_date = order_date;
        this.order_total = order_total;
        this.customer_id = customer_id;
    }
}