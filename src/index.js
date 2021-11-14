import { createServer } from 'http'
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import Prisma from '@prisma/client/index.js';
const { PrismaClient } = Prisma;
import { getUserId } from './utils.js';

import * as Query from './resolvers/Query.js';
import * as Mutation from './resolvers/Mutation.js';
import * as Subscription from './resolvers/Subscription.js';
import * as User from './resolvers/User.js';
import * as Link from './resolvers/Link.js';
import * as Vote from './resolvers/Vote.js';

import { PubSub } from 'graphql-subscriptions';
import typeDefs from './schema/index.js';

(async function() {

  const app = express();
  const corsOptions = {
    origin: '*',
    credentials: true
  };

  const httpServer = createServer(app);
  const pubsub = new PubSub();

  const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
  }

  const prisma = new PrismaClient();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  const subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect(connectionParams, webSocket, context) {
      console.log("Connected to websocket")
      context.pubsub = pubsub;
      return context;
    }
  }, {
    server: httpServer,
    path: '/',
  })

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        pubsub,
        userId: req && req.headers.authorization ? getUserId(req) : null
      }
    },
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        }
      }
    }],
  })

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/', cors: corsOptions })

  httpServer.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
  })
})();
