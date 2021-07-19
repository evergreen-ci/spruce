import { useQuery } from "@apollo/client";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { Dropdown } from "./Dropdown";

export const UserDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { displayName } = user || {};

  const menuItems = [
    {
      text: "Preferences",
      to: getPreferencesRoute(PreferencesTabRoutes.Profile),
    },
    {
      text: "Notifications",
      to: getPreferencesRoute(PreferencesTabRoutes.Notifications),
    },
  ];

  return (
    <Dropdown
      dataCy="user-dropdown-link"
      menuItems={menuItems}
      title={displayName}
    />
  );
};
