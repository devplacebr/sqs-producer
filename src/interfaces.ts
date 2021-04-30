export interface MessageInput {
  queueUrl: string;
  data: unknown | unknown[];
  isFifo?: boolean;
}
