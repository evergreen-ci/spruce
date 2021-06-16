import { useQuery } from "@apollo/client";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { DropdownItem, Dropdown } from "./Dropdown";

export const UserDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { displayName } = user || {};

  return (
    <Dropdown dataCy="user-dropdown-link" title={displayName}>
      <DropdownItem to={getPreferencesRoute(PreferencesTabRoutes.Profile)}>
        Preferences
      </DropdownItem>
      <DropdownItem
        to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}
      >
        Notifications
      </DropdownItem>
    </Dropdown>
  );
};
