import {SQSClient as SQS, SendMessageCommand} from '@aws-sdk/client-sqs';
import {v4 as uuid} from 'uuid';
import {MessageInput, MessageInputFifo} from './interfaces';

export class SqsService {
  private readonly client = new SQS({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  async send(input: MessageInput) {
    const {queueUrl} = input;

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(input),
    });

    await this.client.send(command);
  }

  async sendFifo(input: MessageInputFifo) {
    const {APP_NAME = 'sqs-producer'} = process.env;
    const {
      queueUrl,
      messageGroupId = APP_NAME,
      messageDeduplicationId = uuid(),
    } = input;

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageDeduplicationId: messageDeduplicationId,
      MessageGroupId: messageGroupId,
      MessageBody: JSON.stringify(input),
    });

    await this.client.send(command);
  }
}
