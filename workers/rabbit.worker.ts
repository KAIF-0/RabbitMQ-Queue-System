import { connect, type Channel, type Message } from "amqplib";

const RABBITMQ_URL: string = Bun.env.RABBITMQ_URL!;

export async function connectToRabbitMQ() {
  if (!RABBITMQ_URL) {
    console.log("RABBITMQ_URL is not set");
    return;
  }
  const connection = await connect(RABBITMQ_URL, {
    heartbeat: 60,
  });
  const channel = await connection.createChannel();
  return channel;
}

// Queueing System
export async function subscribeToQueue(
  channel: Channel,
  queueName: string,
  callback: (message: string) => void
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertQueue(queueName, {
    durable: true,
  });
  channel.consume(
    queueName,
    (message: Message | null) => {
      callback(message?.content.toString() as string);
      // channel.ack(message as Message);
    },
    {
      noAck: true,
    }
  );
}

export async function publishToQueue(
  channel: Channel,
  queueName: string,
  data: string
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(data));
}

// Pub/Sub System
export async function PubSubProducer(
  channel: Channel,
  exchange: string,
  data: string
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertExchange(exchange, "fanout", {
    durable: false,
  });
  await channel.publish(exchange, "", Buffer.from(data));
}

export async function PubSubConsumer(
  channel: Channel,
  exchange: string,
  queueName: string,
  callback: (message: string) => void
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertExchange(exchange, "fanout", {
    durable: false,
  });
  const q = await channel.assertQueue(queueName, { exclusive: false });
  await channel.bindQueue(q.queue, exchange, "");
  channel.consume(q.queue, (message: Message | null) => {
    if (message) {
      callback(message.content.toString());
      channel.ack(message);
    }
  });
}

// Pub/Sub System with routing key

export async function PubSubProducerWithRoutingKey(
  channel: Channel,
  exchange: string,
  routingKey: string,
  data: string
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertExchange(exchange, "direct", { durable: false });
  channel.publish(exchange, routingKey, Buffer.from(data));
}
  
export async function PubSubConsumerWithRoutingKey(
  channel: Channel,
  exchange: string,
  routingKey: string,
  queueName: string,
  callback: (message: string) => void
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertExchange(exchange, "direct", {
    durable: false,
  });
  const q = await channel.assertQueue(queueName, { exclusive: false });
  await channel.bindQueue(q.queue, exchange, routingKey);
  channel.consume(q.queue, (message: Message | null) => {
    if (message) {
      callback(message.content.toString() + message.fields.routingKey);
      channel.ack(message);
    }
  });
}

// Pub/Sub System with topic

export async function PubSubProducerWithTopic(
  channel: Channel,
  exchange: string,
  routingKey: string,
  data: string
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertExchange(exchange, "topic", { durable: false });
  channel.publish(exchange, routingKey, Buffer.from(data));
}

export async function PubSubConsumerWithTopic(
  channel: Channel,
  exchange: string,
  routingKey: string,
  callback: (message: string) => void
) {
  if (!channel) {
    console.log("RABBITMQ is not connected!");
    return;
  }
  await channel.assertExchange(exchange, "topic", {
    durable: false,
  });
  const q = await channel.assertQueue("", { exclusive: false });
  await channel.bindQueue(q.queue, exchange, routingKey);
  channel.consume(q.queue, (message: Message | null) => {
    if (message) {
      callback(message.content.toString() + message.fields.routingKey);
      channel.ack(message);
    }
  });
}
