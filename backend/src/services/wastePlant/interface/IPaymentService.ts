export interface IPaymentService {
    fetchPayments(plantId: string): Promise<any>;
}