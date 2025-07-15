import type { Channel, Message } from "amqplib";
import {
  connectToRabbitMQ,
  publishToQueue,
  PubSubProducer,
  PubSubProducerWithRoutingKey,
  PubSubProducerWithTopic,
} from "./workers/rabbit.worker";

const channel = await connectToRabbitMQ();

// console.log(await connectToRabbitMQ());

//publichsing messages for queue system
setInterval(async () => {
  await publishToQueue(channel as Channel, "test", "Hello World_1");
}, 1000);

//publichsing message for pub/sub system
setInterval(async () => {
  await PubSubProducer(channel as Channel, "logs_1", "Hello World_2");
}, 1000);

//publichsing message for pub/sub system with routing key
setInterval(async () => {
  await PubSubProducerWithRoutingKey(
    channel as Channel,
    "logs_2",  
    "routingKey_1",
    "Hello World_1"
  );
}, 1000);

setInterval(async () => {
  await PubSubProducerWithRoutingKey(
    channel as Channel,
    "logs_2",
    "routingKey_2", //with different routing key
    "Hello World_2"
  );
}, 1000);

//publichsing message for pub/sub system with topics
setInterval(async () => { 
  await PubSubProducerWithTopic(
    channel as Channel,
    "logs_3",
    "anonymous.info",
    "Hello World_1"
  );
}, 1000);

setInterval(async () => {
  await PubSubProducerWithTopic(
    channel as Channel,
    "logs_3",
    "anonymous.info.critical", //with different topic
    "Hello World_2"
  );
}, 1000);
