import IPayments from "../core/ports/IPayments";

export default class MercadoPago implements IPayments{

    constructor(){
        /////////////////////////////////////////
        //
        //Initializes Payment API from a provider
        //
        //TODO
        //
        /////////////////////////////////////////
    }
    
    makePayment (orderId: number, orderValue: number): boolean {
        
        //fake interaction mocking a payment process
        if (orderId > 0){
            return true;
        } else {
            return false;
        }
    }
}