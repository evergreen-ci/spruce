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

async function getClientLink(): Promise<HttpLink | SchemaLink | null> {
  const gqlURI = getGQLUrl();
  const httpLink: HttpLink = new HttpLink({
    uri: gqlURI
  });
  if (isDevelopment() || isTest()) {
    const schemaStr = getSchemaString();
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
        "Unable to create local gql schema. Provide valid value for REACT_APP_GQL_URL or REACT_APP_SCHEMA_STRING environment variables",
        e
      );
      return null;
    }
    return new SchemaLink({ schema: executableSchema });
  } else {
    return httpLink;
  }
}

const cache: InMemoryCache = new InMemoryCache();

const GQLWrapper = ({ children }: { children: JSX.Element }) => {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function setGQLClient() {
      const link: HttpLink | SchemaLink = await getClientLink();
      const client: ApolloClient<NormalizedCacheObject> = link
        ? new ApolloClient({
            link,
            cache
          })
        : null;
      setClient(client);
    }
    setGQLClient();
  });

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <>{children}</>
  );
};

export default GQLWrapper;
