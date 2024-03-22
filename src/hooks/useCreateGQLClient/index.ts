import { useEffect, useState } from "react";
import { HttpLink, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useAuthDispatchContext } from "context/Auth";
import { cache } from "gql/client/cache";
import {
  authenticateIfSuccessfulLink,
  authLink,
  logGQLToSentryLink,
  logErrorsLink,
  retryLink,
} from "gql/client/link";
import { secretFieldsReq } from "gql/fetch";
import { environmentVariables } from "utils";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";
import { fetchWithRetry, shouldLogoutAndRedirect } from "utils/request";

const { getGQLUrl } = environmentVariables;

export const useCreateGQLCLient = (): ApolloClient<NormalizedCacheObject> => {
  const { dispatchAuthenticated, logoutAndRedirect } = useAuthDispatchContext();
  const [secretFields, setSecretFields] = useState<string[]>();
  const [gqlClient, setGQLClient] = useState<any>();

  useEffect(() => {
    fetchWithRetry(getGQLUrl(), secretFieldsReq)
      .then(({ data }) => {
        dispatchAuthenticated();
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
        if (shouldLogoutAndRedirect(err?.cause?.statusCode)) {
          logoutAndRedirect();
        }
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
