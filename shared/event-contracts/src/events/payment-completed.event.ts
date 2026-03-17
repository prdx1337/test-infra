export class PaymentCompletedEvent {
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
    public readonly amount: number,
  ) {}
}