import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { routes } from "constants/routes";
import { useAuthDispatchContext } from "context/auth";
import { reportError } from "utils/errorReporting";
import { getGQLUrl } from "utils/getEnvironmentVariables";

const GQLWrapper: React.FC = ({ children }) => {
  const { logout, dispatchAuthenticated } = useAuthDispatchContext();
  return (
    <ApolloProvider
      client={getGQLClient({
        credentials: "include",
        gqlURL: getGQLUrl(),
        logout,
        dispatchAuthenticated,
      })}
    >
      {children}
    </ApolloProvider>
  );
};

interface ClientLinkParams {
  credentials?: string;
  gqlURL?: string;
  logout?: () => void;
  dispatchAuthenticated?: () => void;
}

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ["userId"],
    },
  },
});

const authLink = (logout: () => void): ApolloLink =>
  onError(({ networkError }) => {
    if (
      // must perform these checks so that TS does not complain bc typings for network does not include 'statusCode'
      networkError &&
      "statusCode" in networkError &&
      networkError.statusCode === 401 &&
      window.location.pathname !== routes.login
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

const authenticateIfSuccessfulLink = (dispatchAuthenticated): ApolloLink =>
  new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      if (response && response.data) {
        // if there is data in response then server responded with 200; therefore, is authenticated.
        dispatchAuthenticated();
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

const getGQLClient = ({
  credentials,
  gqlURL,
  logout,
  dispatchAuthenticated,
}: ClientLinkParams) => {
  const link = new HttpLink({
    uri: gqlURL,
    credentials,
  });

  const client = new ApolloClient({
    cache,
    link: authenticateIfSuccessfulLink(dispatchAuthenticated)
      .concat(authLink(logout))
      .concat(logErrorsLink)
      .concat(retryLink)
      .concat(link),
  });

  return client;
};

export default GQLWrapper;
