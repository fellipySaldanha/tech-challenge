export default interface IPayments{
    makePayment (orderId: number, orderValue: number): boolean;
}