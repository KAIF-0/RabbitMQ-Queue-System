import type { Channel, Message } from "amqplib";
import {
  connectToRabbitMQ,
  PubSubConsumer,
  PubSubConsumerWithRoutingKey,
  subscribeToQueue,
} from "./workers/rabbit.worker";

const channel = await connectToRabbitMQ();

//queue system consumer

//consumer 1
subscribeToQueue(channel as Channel, "test", async (message: string) => {
  console.log("Message received on consumer 1: ", message);
});

// consumer 2
// subscribeToQueue(channel as Channel, "test", (message: string) => {
//   console.log("Message received on consumer 2: ", message);
// });

//pub/sub system consumer
PubSubConsumer(channel as Channel, "logs_1", (message: string) => {
  console.log("Message received on consumer 3: ", message);
});

// PubSubConsumer(channel as Channel, "logs_1", (message: string) => {
//   console.log("Message received on consumer 4: ", message);
// });

//pub/sub system with routing key consumer
PubSubConsumerWithRoutingKey(
  channel as Channel,
  "logs_2",
  "routingKey_1",
  (message: string) => {
    console.log("Message received on consumer 5: ", message);
  }
);

// PubSubConsumerWithRoutingKey(
//   channel as Channel,
//   "logs_2",
//   "routingKey_2",
//   (message: string) => {
//     console.log("Message received on consumer 6: ", message);
//   }
// );
