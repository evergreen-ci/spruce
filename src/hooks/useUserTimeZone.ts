import { useQuery } from "@apollo/client";
import { GetUserSettingsQuery } from "gql/generated/types";
import { GET_USER_SETTINGS } from "gql/queries";

// get the timezone for the user
export const useUserTimeZone = () => {
  const { data } = useQuery<GetUserSettingsQuery>(GET_USER_SETTINGS);
  return (
    data?.userSettings?.timezone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
};
