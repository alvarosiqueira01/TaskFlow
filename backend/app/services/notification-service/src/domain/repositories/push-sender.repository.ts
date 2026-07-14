export interface PushMessage {
  deviceToken: string;
  title: string;
  body: string;
}

/**
 * Port implemented by the Infrastructure layer (Amazon SNS adapter).
 */
export interface PushSenderRepository {
  send(message: PushMessage): Promise<void>;
}
