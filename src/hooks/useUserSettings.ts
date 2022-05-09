import { useQuery } from "@apollo/client";
import {
  GetUserSettingsQuery,
  GetUserSettingsQueryVariables,
} from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";

type UseUserSettingsOptions = {
  onError?: (error: Error) => void;
};

export const useUserSettings = (options?: UseUserSettingsOptions) => {
  const { data, loading } = useQuery<
    GetUserSettingsQuery,
    GetUserSettingsQueryVariables
  >(GET_USER_SETTINGS, {
    onError(err) {
      options?.onError?.(err);
    },
  });
  const { userSettings } = data || {};
  return { userSettings, loading };
};
