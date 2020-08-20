import React, { useState, useEffect } from "react";
// import { ApolloClient } from "apollo-client";
// import { ApolloProvider } from "@apollo/react-hooks";
// import { HttpLink } from "apollo-link-http";
// import { ApolloLink } from "apollo-link";
// import { RetryLink } from "apollo-link-retry";
// import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
// import {
//   addMockFunctionsToSchema,
//   introspectSchema,
//   makeExecutableSchema,
// } from "graphql-tools";
// import { printSchema } from "graphql/utilities/schemaPrinter";
// import { SchemaLink } from "apollo-link-schema";
// import { onError } from "apollo-link-error";
// import ApolloLinkTimeout from "apollo-link-timeout";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";
// import { getGQLUrl } from "utils/getEnvironmentVariables";
import { useAuthDispatchContext, Logout, Dispatch } from "context/auth";
import { reportError } from "utils/errorReporting";

interface ClientLinkParams {
  credentials?: string;
  gqlURL?: string;
  logout?: Logout;
  dispatch?: Dispatch;
}

export const getClientLink = async ({
  credentials,
  gqlURL,
}: ClientLinkParams): Promise<HttpLink> => {
  const httpLink = new HttpLink({
    uri: gqlURL,
    credentials,
  });

  // if (
  //   (isDevelopment || isTest) &&
  //   (schemaString || shouldEnableGQLMockServer)
  // ) {
  //   try {
  //     const executableSchema = makeExecutableSchema({
  //       typeDefs: schemaString || printSchema(await introspectSchema(httpLink)),
  //     });
  //     addMockFunctionsToSchema({ schema: executableSchema });
  //     return new SchemaLink({ schema: executableSchema });
  //   } catch (e) {
  //     // unable to initiate mock server
  //     return new HttpLink();
  //   }
  // }
  return httpLink;
};

const cache = new InMemoryCache();

const authLink = (logout: Logout): ApolloLink =>
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

const logErrorsLink = onError(({ graphQLErrors }) => {
  if (Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach((gqlErr) => {
      reportError(gqlErr).warning();
    });
  }
  // dont track network errors here because they are
  // very common when a user is not authenticated
});

// const timeoutLink = new ApolloLinkTimeout(60000);

const authenticateIfSuccessfulLink = (dispatch: Dispatch): ApolloLink =>
  new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      if (response && response.data) {
        // if there is data in response then server responded with 200; therefore, is authenticated.
        dispatch({ type: "authenticate" });
      }
      return response;
    })
  );

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 3000,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error): boolean =>
      error && error.response && error.response.status >= 500,
  },
});

export const getGQLClient = async ({
  credentials,
  gqlURL,
  logout,
  dispatch,
}: ClientLinkParams): Promise<ApolloClient<NormalizedCacheObject>> => {
  const link: HttpLink = await getClientLink({
    credentials,
    gqlURL,
  });
  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: authenticateIfSuccessfulLink(dispatch)
      .concat(authLink(logout))
      .concat(logErrorsLink)
      .concat(retryLink)
      .concat(link),
  });
  return client;
};

const GQLWrapper: React.FC<ClientLinkParams> = ({
  children,
  credentials,
  gqlURL,
}) => {
  const [client, setClient] = useState(null);
  const { logout, dispatch } = useAuthDispatchContext();

  useEffect(() => {
    async function getAndSetClient(): Promise<void> {
      const gqlClient = await getGQLClient({
        credentials,
        gqlURL,
        logout,
        dispatch,
      });
      setClient(gqlClient);
    }
    getAndSetClient();
  }, [credentials, gqlURL, logout, dispatch]);
  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  );
};

export default GQLWrapper;
