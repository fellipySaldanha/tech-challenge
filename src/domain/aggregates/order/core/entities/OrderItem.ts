export default class OrderItem {
    order_id: number;
    item_id: number;
    order_item_qtd: number;
    
    constructor(orderId: number, itemId: number, quantity: number) {
        this.order_id = orderId;
        this.item_id = itemId;
        this.order_item_qtd = quantity;
    }
}