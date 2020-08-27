import React, { useState, useEffect } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";
import { useAuthDispatchContext, Logout, Dispatch } from "context/auth";
import { reportError } from "utils/errorReporting";
import { getGQLUrl } from "utils/getEnvironmentVariables";

const GQLWrapper: React.FC = ({ children }) => {
  const [client, setClient] = useState(null);
  const { logout, dispatch } = useAuthDispatchContext();

  useEffect(() => {
    async function getAndSetClient(): Promise<void> {
      const gqlClient = await getGQLClient({
        credentials: "include",
        gqlURL: getGQLUrl(),
        logout,
        dispatch,
      });
      setClient(gqlClient);
    }
    getAndSetClient();
  }, [logout, dispatch]);

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <></>
  );
};

interface ClientLinkParams {
  credentials?: string;
  gqlURL?: string;
  logout?: Logout;
  dispatch?: Dispatch;
}

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

export const getGQLClient = ({
  credentials,
  gqlURL,
  logout,
  dispatch,
}: ClientLinkParams) => {
  const link = new HttpLink({
    uri: gqlURL,
    credentials,
  });

  const client = new ApolloClient({
    cache,
    link: authenticateIfSuccessfulLink(dispatch)
      .concat(authLink(logout))
      .concat(logErrorsLink)
      .concat(retryLink)
      .concat(link),
  });

  return client;
};

export default GQLWrapper;
