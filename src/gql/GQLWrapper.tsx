import React, { useState, useEffect } from "react";
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
import { onError } from "apollo-link-error";
import { useAuthDispatchContext, Logout } from "context/auth";

interface ClientLinkParams {
  credentials?: string;
  gqlURL?: string;
  isDevelopment?: boolean;
  isTest?: boolean;
  schemaString?: string;
  shouldEnableGQLMockServer?: boolean;
  logout?: Logout;
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

const authLink = (logout: Logout) =>
  onError(({ networkError }) => {
    if (
      // must perform these checks so that TS does not complain bc typings for network does not include 'statusCode'
      networkError &&
      "statusCode" in networkError &&
      networkError.statusCode === 401
    ) {
      logout();
    }
  });

export const getGQLClient = async ({
  credentials,
  gqlURL,
  isDevelopment,
  isTest,
  schemaString,
  shouldEnableGQLMockServer,
  logout
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
    link: authLink(logout).concat(link)
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
  const { logout } = useAuthDispatchContext();

  useEffect(() => {
    async function getAndSetClient() {
      const gqlClient = await getGQLClient({
        credentials,
        gqlURL,
        isDevelopment,
        isTest,
        schemaString,
        shouldEnableGQLMockServer,
        logout
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
    shouldEnableGQLMockServer,
    logout
  ]);

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  );
};

export default GQLWrapper;
