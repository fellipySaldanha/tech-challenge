export default interface OrderItemDTO{
    order_id: number;
    item_id: number;
    order_item_qtd: number;
}

export default interface OrderDTO {
    id: number;
    order_date: Date;
    order_total: number;
    customer_id: number;
    order_items: OrderItemDTO[];
}