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
import { environmentalVariables, errorReporting } from "utils";

const { reportError, leaveBreadcrumb } = errorReporting;

const { getGQLUrl } = environmentalVariables;

const GQLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logoutAndRedirect, dispatchAuthenticated } = useAuthDispatchContext();
  return (
    <ApolloProvider
      client={getGQLClient({
        credentials: "include",
        gqlURL: getGQLUrl(),
        logoutAndRedirect,
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
  logoutAndRedirect?: () => void;
  dispatchAuthenticated?: () => void;
}

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ["userId"],
    },
    TaskLogs: {
      keyFields: ["execution", "taskId"],
    },
    Task: {
      keyFields: ["execution", "id"],
      fields: {
        annotation: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
      },
    },
    Patch: {
      fields: {
        time: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
      },
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
      reportError({
        name: "GraphQL Error",
        message: gqlErr.message,
        metadata: gqlErr,
      }).warning();
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
      leaveBreadcrumb(
        "Graphql Request",
        {
          operationName: operation.operationName,
          variables: operation.variables,
          status: response.data ? "OK" : "ERROR",
          errors: response.errors,
        },
        "request"
      );
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
  logoutAndRedirect,
  dispatchAuthenticated,
}: ClientLinkParams) => {
  const link = new HttpLink({
    uri: gqlURL,
    credentials,
  });

  const client = new ApolloClient({
    cache,
    link: authenticateIfSuccessfulLink(dispatchAuthenticated)
      .concat(authLink(logoutAndRedirect))
      .concat(logErrorsLink)
      .concat(retryLink)
      .concat(link),
  });

  return client;
};

export default GQLWrapper;
