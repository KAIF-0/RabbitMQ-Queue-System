import type { Channel, Message } from "amqplib";
import {
  connectToRabbitMQ,
  PubSubConsumer,
  PubSubConsumerWithRoutingKey,
  PubSubConsumerWithTopic,
  subscribeToQueue,
} from "./workers/rabbit.worker";

const channel = await connectToRabbitMQ();

//queue system consumer
subscribeToQueue(channel as Channel, "test", async (message: string) => {
  console.log("Message received on consumer 1: ", message);
});

subscribeToQueue(channel as Channel, "test", (message: string) => {
  console.log("Message received on consumer 2: ", message);
});

//pub/sub system consumer
PubSubConsumer(channel as Channel, "logs_1", "queue_1", (message: string) => {
  console.log("Message received on consumer 1: ", message);
});

PubSubConsumer(channel as Channel, "logs_1", "queue_2", (message: string) => {
  console.log("Message received on consumer 2: ", message);
});

//pub/sub system with routing key consumer
PubSubConsumerWithRoutingKey(
  channel as Channel,
  "logs_2",
  "routingKey_1",
  (message: string) => {
    console.log("Message received on consumer 1: ", message);
  }
);

PubSubConsumerWithRoutingKey(
  channel as Channel,
  "logs_2",
  "routingKey_2",
  (message: string) => {
    console.log("Message received on consumer 2: ", message);
  }
);

//pub/sub system with topicsconsumer
PubSubConsumerWithTopic(
  channel as Channel,
  "logs_3",
  "*.info",
  (message: string) => {
    console.log("Message received on consumer 1: ", message);
  }
);

PubSubConsumerWithTopic(
  channel as Channel,
  "logs_3",
  "*.info.*", // "#" for every topic
  (message: string) => {
    console.log("Message received on consumer 2: ", message);
  }
);
