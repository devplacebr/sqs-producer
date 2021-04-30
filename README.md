# DEVPLACE SQS PRODUCER

Devplace SQS producer for fifo and standard queues.

Usefull to send async jobs.

## Instalation

* ```yarn add @devplace/sqs-producer```


## LOCAL CONFIGURATION

Configure your env vars:

```bash
  AWS_SQS_REGION=YOUR-AWS-SQS-REGION-DEFAULTS-TO-US-EAST-1
  AWS_SQS_ACCESS_KEY_ID=YOUR-AWS-SQS-ACCESS-KEY
  AWS_SQS_SECRET_ACCESS_KEY=YOUR-AWS-SQS-SECRET-KEY
```


## USE

```typescript
const { SqsService } = require('@devplace/sqs-producer')
// import { SqsService } from '@devplace/sqs-producer' // Typescript approach

const client = new SqsService()

// function send(input: MessageInput){ // Typescript approach
function send(input){
  await client.send(input);
}

// Call standard queue
send({
  queueUrl: "string", // Required
  data: { foo: 'bar' } // Required
});

// Call fifo queue
send({
  queueUrl: "string", // Required
  data: { foo: "bar" }, // Required
  isFifo: true // Will create a 'messageDeduplicationId' and a 'messageGroupId' automaticalky (AWS PARAMETERS)
});

// Call batch
send({
  queueUrl: "string", // Required
  data: [{ foo: 'bar' }, { foo2: 'bar2' }] // Chunked automatically (AWS limit is 10 jobs per call)
});

```


## IAM Policy example for send SQS Messages

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sqs:SendMessage",
            "Resource": "*"
        }
    ]
}
```