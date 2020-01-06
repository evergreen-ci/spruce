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
  credentials?: string;
  gqlURL?: string;
  isDevelopment?: boolean;
  isTest?: boolean;
  schemaString?: string;
}

export const getClientLink = async ({
  gqlURL,
  isDevelopment,
  isTest,
  schemaString,
  credentials
}: ClientLinkParams): Promise<HttpLink | SchemaLink> => {
  const httpLink: HttpLink = new HttpLink({
    uri: gqlURL,
    credentials
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
        "Unable to create mock server. Provide a valid value for REACT_APP_GQL_URL or REACT_APP_SCHEMA_STRING environment variables.",
        e
      );
      return new HttpLink();
    }
    return new SchemaLink({ schema: executableSchema });
  } else {
    return httpLink;
  }
};

const cache: InMemoryCache = new InMemoryCache();

export const getGQLClient = async ({
  credentials,
  gqlURL,
  isDevelopment,
  isTest,
  schemaString
}: ClientLinkParams) => {
  const link: HttpLink | SchemaLink = await getClientLink({
    credentials,
    gqlURL,
    isDevelopment,
    isTest,
    schemaString
  });
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link
  });
  return client;
};

const GQLWrapper: React.FC<ClientLinkParams> = ({
  children,
  credentials,
  gqlURL,
  isDevelopment,
  isTest,
  schemaString
}) => {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function getAndSetClient() {
      const gqlClient = await getGQLClient({
        credentials,
        gqlURL,
        isDevelopment,
        isTest,
        schemaString
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
