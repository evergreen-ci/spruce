import { useQuery } from "@apollo/client";
import { useToastContext } from "context/toast";
import {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";

export const useUserSettings = () => {
  const dispatchToast = useToastContext();
  const { data, loading } = useQuery<
    GetUserSettingsQuery,
    GetUserSettingsQueryVariables
  >(GET_USER_SETTINGS, {
    onError(err) {
      dispatchToast.error(
        `There was an error fetching your user settings: ${err.message}`
      );
    },
  });
  const { userSettings } = data || {};
  return { userSettings, loading };
};
