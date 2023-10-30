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
import { useAuthDispatchContext } from "context/Auth";
import { environmentVariables } from "utils";
import {
  leaveBreadcrumb,
  reportError,
  SentryBreadcrumb,
} from "utils/errorReporting";

const { getGQLUrl } = environmentVariables;

const GQLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthDispatchContext();
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
    Query: {
      fields: {
        distroEvents: {
          keyArgs: ["$distroId"],
        },
        projectEvents: {
          keyArgs: ["$identifier"],
        },
        repoEvents: {
          keyArgs: ["$id"],
        },
      },
    },
    GeneralSubscription: {
      keyFields: false,
    },
    DistroEventsPayload: {
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
    ProjectAlias: {
      keyFields: false,
    },
    Project: {
      keyFields: false,
    },
    User: {
      keyFields: ["userId"],
    },
    Task: {
      keyFields: ["execution", "id"],
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
      leaveBreadcrumb(
        "Not Authenticated",
        { status_code: 401 },
        SentryBreadcrumb.User
      );
      logout();
    }
  });

const logErrorsLink = onError(({ graphQLErrors, operation }) => {
  if (Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach((gqlErr) => {
      reportError(new Error(gqlErr.message), {
        gqlErr,
        operationName: operation.operationName,
        variables: operation.variables,
      }).warning();
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
          operationName: operation.operationName,
          variables: operation.variables,
          status: !response.errors ? "OK" : "ERROR",
          errors: response.errors,
        },
        SentryBreadcrumb.HTTP
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
  dispatchAuthenticated,
  gqlURL,
  logoutAndRedirect,
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

export { cache };
export default GQLWrapper;
