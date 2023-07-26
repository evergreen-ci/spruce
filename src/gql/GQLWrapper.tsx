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
import { environmentVariables } from "utils";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";

const { getGQLUrl } = environmentVariables;

const GQLWrapper: React.VFC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthDispatchContext();
  return (
    <ApolloProvider
      client={getGQLClient({
        credentials: "include",
        dispatchAuthenticated,
        gqlURL: getGQLUrl(),
        logoutAndRedirect,
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
    GeneralSubscription: {
      keyFields: false,
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
    Project: {
      keyFields: false,
    },
    ProjectAlias: {
      keyFields: false,
    },
    ProjectEvents: {
      fields: {
        count: {
          merge(existing = 0, incoming = 0) {
            return existing + incoming;
          },
        },
        eventLogEntries: {
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Query: {
      fields: {
        projectEvents: {
          keyArgs: ["$identifier"],
        },
        repoEvents: {
          keyArgs: ["$id"],
        },
      },
    },
    Task: {
      fields: {
        annotation: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
        taskLogs: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
      keyFields: ["execution", "id"],
    },
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
      leaveBreadcrumb("Not Authenticated", { statusCode: 401 }, "user");
      logout();
    }
  });

const logErrorsLink = onError(({ graphQLErrors, operation }) => {
  if (Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach((gqlErr) => {
      reportError(
        {
          message: "GraphQL Error",
          name: gqlErr.message,
        },
        {
          gqlErr,
          operationName: operation.operationName,
          variables: operation.variables,
        }
      ).warning();
    });
  }
  // dont track network errors here because they are
  // very common when a user is not authenticated
});

const authenticateIfSuccessfulLink = (
  dispatchAuthenticated: () => void
): ApolloLink =>
  new ApolloLink((operation, forward) =>
    forward(operation).map((response) => {
      if (response && response.data) {
        // if there is data in response then server responded with 200; therefore, is authenticated.
        dispatchAuthenticated();
      }
      leaveBreadcrumb(
        "Graphql Request",
        {
          errors: response.errors,
          operationName: operation.operationName,
          status: !response.errors ? "OK" : "ERROR",
          variables: operation.variables,
        },
        "request"
      );
      return response;
    })
  );

const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: (error): boolean =>
      error && error.response && error.response.status >= 500,
  },
  delay: {
    initial: 300,
    jitter: true,
    max: 3000,
  },
});

const getGQLClient = ({
  credentials,
  dispatchAuthenticated,
  gqlURL,
  logoutAndRedirect,
}: ClientLinkParams) => {
  const link = new HttpLink({
    credentials,
    uri: gqlURL,
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

export { cache };
export default GQLWrapper;
