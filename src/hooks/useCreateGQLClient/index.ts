import { useEffect, useState } from "react";
import { HttpLink, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { OperationDefinitionNode } from "graphql";
import { useAuthDispatchContext } from "context/Auth";
import { cache } from "gql/client/cache";
import {
  authenticateIfSuccessfulLink,
  authLink,
  logGQLToSentryLink,
  logErrorsLink,
  retryLink,
} from "gql/client/link";
import { SECRET_FIELDS } from "gql/queries";
import { environmentVariables } from "utils";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import { fetchWithRetry } from "utils/request";

const { getGQLUrl } = environmentVariables;

export const useCreateGQLCLient = (): ApolloClient<NormalizedCacheObject> => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthDispatchContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGQLClient] = useState<any>();

  useEffect(() => {
    fetchWithRetry(getGQLUrl(), secretFieldsReq)
      .then(({ data }) => {
        setSecretFields(data?.spruceConfig?.secretFields);
      })
      .catch((err) => {
        leaveBreadcrumb(
          "SecretFields Query Error",
          {
            err,
          },
          SentryBreadcrumb.HTTP,
        );
      });
  }, []);

  useEffect(() => {
    if (secretFields && !gqlClient) {
      const client = new ApolloClient({
        cache,
        link: authenticateIfSuccessfulLink(dispatchAuthenticated)
          .concat(authLink(logoutAndRedirect))
          .concat(logGQLToSentryLink(secretFields))
          .concat(logErrorsLink)
          .concat(retryLink)
          .concat(
            new HttpLink({
              uri: getGQLUrl(),
              credentials: "include",
            }),
          ),
      });
      setGQLClient(client);
    }
  }, [secretFields, gqlClient, dispatchAuthenticated, logoutAndRedirect]);

  return gqlClient;
};

const secretFieldsReq = {
  credentials: "include" as RequestCredentials,
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    operationName: (SECRET_FIELDS.definitions[0] as OperationDefinitionNode)
      .name.value,
    query: SECRET_FIELDS.loc?.source.body,
    variables: {},
  }),
  method: "POST",
  mode: "cors" as RequestMode,
};
