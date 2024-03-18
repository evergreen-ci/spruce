import { ApolloLink, ServerParseError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import {
  leaveBreadcrumb,
  SentryBreadcrumb,
  reportError,
} from "utils/errorReporting";
import { shouldLogoutAndRedirect } from "utils/request";

export { logGQLToSentryLink } from "./logGQLToSentryLink";

export const authLink = (logoutAndRedirect: () => void): ApolloLink =>
  onError(({ networkError }) => {
    if (
      shouldLogoutAndRedirect((networkError as ServerParseError)?.statusCode)
    ) {
      leaveBreadcrumb(
        "Not Authenticated",
        { status_code: 401 },
        SentryBreadcrumb.User,
      );
      logoutAndRedirect();
    }
  });

export const logErrorsLink = onError(({ graphQLErrors, operation }) => {
  if (Array.isArray(graphQLErrors)) {
    graphQLErrors.forEach((gqlErr) => {
      const fingerprint = [operation.operationName];
      if (gqlErr?.path?.length) {
        fingerprint.push(...gqlErr.path);
      }
      reportError(new Error(gqlErr.message), {
        fingerprint,
        tags: { operationName: operation.operationName },
        context: {
          gqlErr,
          variables: operation.variables,
        },
      }).warning();
    });
  }
  // dont track network errors here because they are
  // very common when a user is not authenticated
});

export const authenticateIfSuccessfulLink = (
  dispatchAuthenticated: () => void,
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
        SentryBreadcrumb.HTTP,
      );
      return response;
    }),
  );

export const retryLink = new RetryLink({
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
