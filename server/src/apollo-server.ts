import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import {
    ApolloServer,
    ExpressContext,
    gql,
} from "apollo-server-express"
import * as express from "express"
import { Server } from "http"
import Db from "./db"


/* 
    In graphql by default things are nullable (say optional). That is say you request for something, it can come back as null
    We use ! to denote that this is "required" (non nullable), which is the opposite of TS
    where we have to denote optional by ?
*/

export async function createApolloServer(
    _db: Db,
    httpServer: Server,
    app: express.Application
): Promise<ApolloServer<ExpressContext>> {
    const typeDefs = gql`
    type Query {
      currentUser: User!
      suggestions: [Suggestion!]!
    }
    type User {
      id: String!
      name: String!
      handle: String!
      coverUrl: String!
      avatarUrl: String!
      createdAt: String!
      updatedAt: String!
    }
    type Suggestion {
      name: String!
      handle: String!
      avatarUrl: String!
      reason: String!
    }
  `
    const server = new ApolloServer({
        typeDefs,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
        ],
    })
    await server.start()
    server.applyMiddleware({ app })
    return server
}