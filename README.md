# DEVPLACE SQS PRODUCER

Devplace SQS producer for fifo and standard queues.

Usefull to send async jobs.

## Instalation

* ```yarn add @devplace/sqs-producer```


## LOCAL CONFIGURATION

Configure your env vars:

```bash
  AWS_REGION=YOUR-AWS-SQS-REGION-DEFAULTS-TO-US-EAST-1
  AWS_ACCESS_KEY_ID=YOUR-AWS-SQS-ACCESS-KEY
  AWS_SECRET_ACCESS_KEY=YOUR-AWS-SQS-SECRET-KEY
```


## USE

```typescript
import { SqsService } from '@devplace/sqs-producer'

const client = new SqsService()

// function send(input: MessageInput){ // Typescript approach
function send(input){
  await client.send(input);
}

// function sendFifo(input: MessageInputFifo){ // Typescript approach
function sendFifo(input){
  await client.sendFifo(input);
}

// Call standard queue
send({
  queueUrl: "strning", // Required
  data: { foo: 'bar' } // Required
});

// Call fifo queue
sendFifo({
  queueUrl: "strning", // Required
  data: { foo: "bar" }, // Required
  messageDeduplicationId: "string", // Optional. Default: generated uuid
  messageGroupId: "string" // Optional. Default: process.env.APP_NAME | 'sqs-producer'
});
```