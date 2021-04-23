export interface MessageInput {
  queueUrl: string;
  data: unknown; // Json object
}
export interface MessageInputFifo extends MessageInput {
  messageDeduplicationId?: string;
  messageGroupId?: string;
}
