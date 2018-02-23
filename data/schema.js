import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Message {
    id: String!
    content: String
}
type Query {
  messages: [String!]!
}
type Mutation {
  addMessage(message: String!): [String!]!
}
type Subscription {
  messageAdded: Message
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
