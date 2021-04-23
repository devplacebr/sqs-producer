export interface MessageInput {
  queueUrl: string;
  data: Record<string, unknown>;
}
export interface MessageInputFifo extends MessageInput {
  messageDeduplicationId?: string;
  messageGroupId?: string;
}
