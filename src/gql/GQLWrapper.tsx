import React from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { GraphQLSchema } from "graphql/type";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { introspectSchema, makeExecutableSchema } from "graphql-tools";
import { printSchema } from "graphql/utilities/schemaPrinter";
import { SchemaLink } from "apollo-link-schema";
import { useEffect, useState } from "react";
import resolvers from "./resolvers";

interface ClientLinkParams {
  gqlURL: string;
  isDevelopment: boolean;
  isTest: boolean;
  schemaString: string;
}

interface Props extends ClientLinkParams {
  children: React.ReactNode;
}

export async function getClientLink({
  gqlURL,
  isDevelopment,
  isTest,
  schemaString
}: ClientLinkParams): Promise<HttpLink | SchemaLink> {
  const httpLink: HttpLink = new HttpLink({
    uri: gqlURL
  });

  if (isDevelopment || isTest) {
    let executableSchema: GraphQLSchema | null = null;
    try {
      executableSchema = makeExecutableSchema({
        typeDefs: schemaString
          ? schemaString
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

export async function getGQLClient({
  isTest,
  isDevelopment,
  schemaString,
  gqlURL
}: ClientLinkParams) {
  const link: HttpLink | SchemaLink = await getClientLink({
    gqlURL,
    isDevelopment,
    isTest,
    schemaString
  });
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link,
    cache
  });
  return client;
}

const GQLWrapper = ({
  children,
  gqlURL,
  isDevelopment,
  isTest,
  schemaString
}: Props) => {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function getAndSetClient() {
      const gqlClient = await getGQLClient({
        isTest,
        isDevelopment,
        schemaString,
        gqlURL
      });
      setClient(gqlClient);
    }
    getAndSetClient();
  }, []);

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  );
};

export default GQLWrapper;
