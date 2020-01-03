import React from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { GraphQLSchema } from "graphql/type";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { introspectSchema, makeExecutableSchema } from "graphql-tools";
import { isDevelopment, isTest, getSchemaString, getGQLUrl } from "../utils";
import { printSchema } from "graphql/utilities/schemaPrinter";
import { SchemaLink } from "apollo-link-schema";
import { useEffect, useState } from "react";
import resolvers from "./resolvers";

async function getClientLink(): Promise<HttpLink | SchemaLink> {
  const gqlURI = getGQLUrl();
  const schemaStr = getSchemaString();
  const httpLink: HttpLink = new HttpLink({
    uri: gqlURI
  });

  if (isDevelopment() || isTest()) {
    let executableSchema: GraphQLSchema | null = null;
    try {
      executableSchema = makeExecutableSchema({
        typeDefs: schemaStr
          ? schemaStr
          : printSchema(await introspectSchema(httpLink)),
        resolvers
      });
    } catch (e) {
      console.log(
        "Unable to create mock server. Provide valid value for REACT_APP_GQL_URL or REACT_APP_SCHEMA_STRING environment variables",
        e
      );
      return new HttpLink();
    }
    return new SchemaLink({ schema: executableSchema });
  } else {
    return httpLink;
  }
}

const cache: InMemoryCache = new InMemoryCache();

export async function getGQLClient() {
  const link: HttpLink | SchemaLink = await getClientLink();
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link,
    cache
  });
  return client;
}

const GQLWrapper = ({ children }: { children: JSX.Element }) => {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function getAndSetClient() {
      const gqlClient = await getGQLClient();
      if (!client) {
        setClient(gqlClient);
      }
    }
    getAndSetClient();
  });

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  );
};

export default GQLWrapper;
