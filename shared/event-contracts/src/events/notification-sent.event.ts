export class NotificationSentEvent {
  constructor(
    public readonly userId: string,
    public readonly message: string,
    public readonly type: string,
  ) {}
}