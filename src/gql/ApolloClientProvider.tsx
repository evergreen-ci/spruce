import React from "react";
import { useAuthDispatchContext, Logout, Dispatch } from "context/auth";
import { reportError } from "utils/errorReporting";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";
import { SchemaLink } from "@apollo/client/link/schema";
import { getGQLUrl } from "utils/getEnvironmentVariables";

// TODO: use ApolloLinkTimeout when it supports apollo client 3 upgrade
// import ApolloLinkTimeout from "apollo-link-timeout";

const cache = new InMemoryCache();

export const ApolloClientProvider: React.FC = ({ children }) => {
  const { logout, dispatch } = useAuthDispatchContext();

  const link: HttpLink | SchemaLink = new HttpLink({
    uri: getGQLUrl(),
    credentials: "include",
  });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: authenticateIfSuccessfulLink(dispatch)
      .concat(authLink(logout))
      .concat(logErrorsLink)
      .concat(retryLink)
      .concat(link),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

// APOLLO LINKS

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
