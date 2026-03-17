export class PaymentCompletedEvent {
  constructor(
    public readonly orderId: string,
    public readonly paymentId: string,
    public readonly amount: number,
  ) {}
}

export class NotificationSentEvent {
  constructor(
    public readonly userId: string,
    public readonly message: string,
    public readonly type: string,
  ) {}
}