import Order from "../../order/core/entities/Order";
import IPayments from "../core/ports/IPayments";

export default class PaymentService{
    private paymentGateway: IPayments;

    constructor(paymentGateway: IPayments){
        this.paymentGateway = paymentGateway;
    }

    payOrder(orderNumber:number, total:number): boolean{
        return this.paymentGateway.makePayment(orderNumber, total);
    }
}