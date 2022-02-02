import { useQuery } from "@apollo/client";
import { useNavbarAnalytics } from "analytics";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { Dropdown } from "./NavDropdown";

export const UserDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { displayName } = user || {};

  const { sendEvent } = useNavbarAnalytics();

  const menuItems = [
    {
      text: "Preferences",
      to: getPreferencesRoute(PreferencesTabRoutes.Profile),
      onClick: () => sendEvent({ name: "Click Preferences Link" }),
    },
    {
      text: "Notifications",
      to: getPreferencesRoute(PreferencesTabRoutes.Notifications),
      onClick: () => sendEvent({ name: "Click Notifications Link" }),
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
