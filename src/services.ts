import {
  SQSClient as SQS,
  SendMessageBatchCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import {v4 as uuid} from 'uuid';
import {MessageInput} from './interfaces';
import {chunkData} from './helpers';

export class SqsService {
  private readonly client: SQS;

  constructor() {
    const {
      AWS_SQS_REGION = 'us-east-1',
      AWS_SQS_ACCESS_KEY_ID,
      AWS_SQS_SECRET_ACCESS_KEY,
    } = process.env;
    if (AWS_SQS_ACCESS_KEY_ID === undefined) {
      throw new Error("env 'AWS_SQS_ACCESS_KEY_ID' was not loaded.");
    } else if (AWS_SQS_SECRET_ACCESS_KEY === undefined) {
      throw new Error("env 'AWS_SQS_SECRET_ACCESS_KEY' was not loaded.");
    }

    this.client = new SQS({
      region: AWS_SQS_REGION,
      credentials: {
        accessKeyId: AWS_SQS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SQS_SECRET_ACCESS_KEY,
      },
    });
  }

  async send(input: MessageInput) {
    if (Array.isArray(input.data)) {
      await this.sendBatch(input);
    } else {
      await this.sendSingle(input);
    }
  }

  private async sendSingle(input: MessageInput) {
    const {APP_NAME = 'sqs-producer'} = process.env;
    const {queueUrl, data, isFifo = false} = input;

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(data),
    });

    if (isFifo) {
      command.input.MessageGroupId = APP_NAME;
      command.input.MessageDeduplicationId = uuid();
    }

    return this.client.send(command);
  }

  private sendBatch(input: MessageInput) {
    const {APP_NAME = 'sqs-producer'} = process.env;
    const {queueUrl, isFifo = false} = input;
    const data = input.data as unknown[];
    if (data.length === 0) return;
    const chunked = chunkData(data, 10);
    const commands = chunked.map(m => {
      return new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: m.map(d => {
          if (isFifo) {
            return {
              Id: uuid(),
              MessageGroupId: APP_NAME,
              MessageDeduplicationId: uuid(),
              MessageBody: JSON.stringify(d),
            };
          }
          return {
            Id: uuid(),
            MessageBody: JSON.stringify(d),
          };
        }),
      });
    });
    return Promise.all(commands.map(x => this.client.send(x)));
  }
}
