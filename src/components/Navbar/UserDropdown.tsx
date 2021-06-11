import { useQuery } from "@apollo/client";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { PreferencesTabRoutes, getPreferencesRoute } from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { Dropdown } from "./Dropdown";

export const UserDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { displayName } = user || {};

  const menuItems = (
    <Menu>
      <Menu.Item>
        <Link to={getPreferencesRoute(PreferencesTabRoutes.Profile)}>
          Preferences
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={getPreferencesRoute(PreferencesTabRoutes.Notifications)}>
          Notifications
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      dataCy="nav-dropdown-link"
      menuItems={menuItems}
      title={displayName}
    />
  );
};
