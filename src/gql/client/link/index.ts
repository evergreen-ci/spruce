import { ApolloLink, ServerParseError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import { shouldLogoutAndRedirect } from "utils/request";

export { logGQLToSentryLink } from "./logGQLToSentryLink";
export { logGQLErrorsLink } from "./logGQLErrorsLink";

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
