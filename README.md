# GraphQL Subscriptions (server) with Redis
This repository includes a working (as of Feb 23, 2018) Apollo GraphQL server implementation providing subscriptions with Redis backing. After scouring various articles and documents, I finally got it working and felt there needs to be a concise HOWTO for what will be a very popular use case.

## Background
In a new product, we wanted realtime notifications to users, and planned on adding a Redis user cache. Our UI is built with React and Redux, so we decided on GraphQL as the API layer (instead of REST), and wanted to leverage the new subscriptions feature, or at least compare it to polling.

# System Requirements
 * Node version 6 or later
 * Terminal (command line interface and `npm`)
 * Redis server 
 * Apollo Engine API Key (because it's cool and free first 1 million queries/mo)
   * https://www.apollographql.com/engine

# TL;DR
 1. Clone and install the app
```
git clone git@github.com:mikesparr/tutorial-graphql-subscriptions-redis.git
cd tutorial-graphql-subscriptions-redis
npm install
```

 2. Add local ENV variables (I use `dotenv` or `.env` file)
```
# environment variables for application
export SERVER_PORT=3000
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

 3. Make sure Redis is running
  * Mac users: `brew install redis && brew services redis start`

 4. Start the server
  * `npm start`

 5. Open browser (1) to http://localhost:3000/graphiql

 6. Open another browser (2) tab to same URL

 7. Open terminal window (1) to Redis monitor
  * `redis-cli monitor`

 8. Open second terminal window (2) to execute Redis CLI commands
  * TIP: don't start interactive session and just wait for steps below

 9. In browser (1), subscribe to messages (paste in graphiql and run)
```
subscription {
  messageAdded {
    id
    content
  }
}
```

 10. In browser (2), publish (mutate) a message (paste in graphiql and run)
```
mutation {
  addMessage(message: "Hello World") 
}
```

 11. In terminal window (1) confirm publish messages appear

 12. In browser (1), confirm message appears

 13. In terminal window (2) publish new message
```
redis-cli PUBLISH "messageAdded" '{"messageAdded": {"id": "555", "content": "Hello Redis"}}'
```

 14. Confirm terminal (1) and browser (1) messages appear

 15. Congratulations! Your GraphQL server delivered subscription messages to a client from both mutations and new messages directly into Redis!

# Important lessons learned
 * You need to publish a server with subscriptions for clients to use the feature
 * You must wrap Express with another http client in `server.js` for web socket conn
 * Redis PubSub messages must include wrapper object with schema subscription name
