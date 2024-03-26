import { Operation } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLError } from "graphql";
import { reportError } from "utils/errorReporting";
import { deleteNestedKey } from "utils/object";

export const reportingFn =
  (secretFields: string[], operation: Operation) => (gqlErr: GraphQLError) => {
    const fingerprint = [operation.operationName];
    const path = gqlErr?.path?.map((v) => v.toString());
    if (path) {
      fingerprint.push(...path);
    }
    reportError(new Error(gqlErr.message), {
      fingerprint,
      tags: { operationName: operation.operationName },
      context: {
        gqlErr,
        variables: deleteNestedKey(
          operation.variables,
          secretFields,
          "REDACTED",
        ),
      },
    }).warning();
  };

export const logGQLErrorsLink = (secretFields: string[]) =>
  onError(({ graphQLErrors, operation }) =>
    graphQLErrors?.forEach(reportingFn(secretFields, operation)),
  );
