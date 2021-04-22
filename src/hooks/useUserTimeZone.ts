import { useQuery } from "@apollo/client";
import { GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";

// get the timezone for the user
export const useUserTimeZone = () => {
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  const { userSettings } = userSettingsData || {};
  const { timezone } = userSettings;
  return timezone;
};
