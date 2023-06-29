export default class Order {
    order_date: Date;
    order_total: number;
    customer_id: string;

    constructor(order_date: Date, order_total: number, customer_id: string, customer_name: string) {
        this.order_date = order_date;
        this.order_total = order_total;
        this.customer_id = customer_id;
    }
}