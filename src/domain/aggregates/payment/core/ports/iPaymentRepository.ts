export default interface IPaymentRepository{
    makePayment (orderId: number, orderValue: number): boolean;
}
