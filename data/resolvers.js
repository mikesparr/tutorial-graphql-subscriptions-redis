import Config from '../config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
const Redis = require('ioredis');

// Instantiate Redis clients
const options = {
  host: Config.redisHost,
  port: Config.redisPort,
  retry_strategy: options => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  }
};
const publisher = new Redis(options);
const subscriber = new Redis(options);
const unsubscriber = new Redis(options);

// Instantiate Redis PubSub 
const pubsub = new RedisPubSub({
  publish: publisher,
  subscribe: subscriber,
  unsubscribe: unsubscriber
});

// Test in-memory database (you would use some real DB in production)
let nextMessageId = 1;
const messages = []

// Resolver
const resolvers = {
  Query: {
    messages(root, {}, context) {
      return messages;
    }
  },
  Mutation: {
    addMessage: (root, { message }) => {
      console.log({message});
      const newMessage = { id: String(nextMessageId++), content: message };
      messages.push(newMessage);
      pubsub.publish(`messageAdded`, { messageAdded: newMessage });
      return messages;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(`messageAdded`),
    },
  },
};

export default resolvers;
