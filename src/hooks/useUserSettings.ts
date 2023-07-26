import { useQuery } from "@apollo/client";
import {
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";

type UseUserSettingsOptions = {
  onError?: (error: Error) => void;
};

export const useUserSettings = (options?: UseUserSettingsOptions) => {
  const { data, loading } = useQuery<
    UserSettingsQuery,
    UserSettingsQueryVariables
  >(GET_USER_SETTINGS, {
    onError(err) {
      options?.onError?.(err);
    },
  });
  const { userSettings } = data || {};
  return { loading, userSettings };
};
