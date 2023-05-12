import { useQuery } from "@apollo/client";
import { useNavbarAnalytics } from "analytics";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { UserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { NavDropdown } from "./NavDropdown";

export const UserDropdown = () => {
  const { data } = useQuery<UserQuery>(GET_USER);
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
    <NavDropdown
      dataCy="user-dropdown-link"
      menuItems={menuItems}
      title={displayName}
    />
  );
};
