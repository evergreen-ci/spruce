import * as React from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import {
  addMockFunctionsToSchema,
  introspectSchema,
  makeExecutableSchema
} from "graphql-tools";
import { printSchema } from "graphql/utilities/schemaPrinter";
import { SchemaLink } from "apollo-link-schema";
const { useState, useEffect } = React;

interface ClientLinkParams {
  credentials?: string;
  gqlURL?: string;
  isDevelopment?: boolean;
  isTest?: boolean;
  schemaString?: string;
  shouldEnableGQLMockServer?: boolean;
}

export const getClientLink = async ({
  credentials,
  gqlURL,
  isDevelopment,
  isTest,
  schemaString,
  shouldEnableGQLMockServer
}: ClientLinkParams): Promise<HttpLink | SchemaLink> => {
  const httpLink = new HttpLink({
    uri: gqlURL,
    credentials
  });

  if (
    (isDevelopment || isTest) &&
    (schemaString || shouldEnableGQLMockServer)
  ) {
    try {
      const executableSchema = makeExecutableSchema({
        typeDefs: schemaString
          ? schemaString
          : printSchema(await introspectSchema(httpLink))
      });
      addMockFunctionsToSchema({ schema: executableSchema });
      return new SchemaLink({ schema: executableSchema });
    } catch (e) {
      console.warn(
        "Unable to initiate mock server. If this was unintended, provide a valid value for the REACT_APP_GQL_URL or REACT_APP_SCHEMA_STRING environment variables."
      );
      return new HttpLink();
    }
  }
  return httpLink;
};

const cache = new InMemoryCache();

export const getGQLClient = async ({
  credentials,
  gqlURL,
  isDevelopment,
  isTest,
  schemaString,
  shouldEnableGQLMockServer
}: ClientLinkParams) => {
  const link: HttpLink | SchemaLink = await getClientLink({
    credentials,
    gqlURL,
    isDevelopment,
    isTest,
    schemaString,
    shouldEnableGQLMockServer
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
  schemaString,
  shouldEnableGQLMockServer
}) => {
  const [client, setClient] = useState(null);
  useEffect(() => {
    async function getAndSetClient() {
      const gqlClient = await getGQLClient({
        credentials,
        gqlURL,
        isDevelopment,
        isTest,
        schemaString,
        shouldEnableGQLMockServer
      });
      setClient(gqlClient);
    }
    getAndSetClient();
  }, [
    credentials,
    gqlURL,
    isDevelopment,
    isTest,
    schemaString,
    shouldEnableGQLMockServer
  ]);

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  );
};

export default GQLWrapper;
