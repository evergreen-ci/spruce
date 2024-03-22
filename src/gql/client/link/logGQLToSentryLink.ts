import { Operation, FetchResult, ApolloLink } from "@apollo/client";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import { deleteNestedKey } from "utils/object";

export const leaveBreadcrumbMapFn =
  (operation: Operation, secretFields: string[]) => (response: FetchResult) => {
    leaveBreadcrumb(
      "Graphql Request",
      {
        operationName: operation.operationName,
        variables: deleteNestedKey(
          operation.variables,
          secretFields,
          "REDACTED",
        ),
        status: !response.errors ? "OK" : "ERROR",
        errors: response.errors,
      },
      SentryBreadcrumb.HTTP,
    );
    return response;
  };

export const logGQLToSentryLink = (secretFields: string[]): ApolloLink =>
  new ApolloLink((operation, forward) =>
    forward(operation).map(leaveBreadcrumbMapFn(operation, secretFields)),
  );
