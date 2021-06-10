import { useQuery } from "@apollo/client";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { legacyRoutes } from "constants/externalResources";
import {
  PreferencesTabRoutes,
  getUserPatchesRoute,
  getPreferencesRoute,
  routes,
} from "constants/routes";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { environmentalVariables } from "utils";
import { Dropdown } from "./Dropdown";

const { getUiUrl } = environmentalVariables;

export const UserDropdown = () => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { user } = data || {};
  const { displayName, userId } = user || {};

  const uiURL = getUiUrl();

  const menuItems = (
    <Menu>
      <Menu.Item>
        <a data-cy="legacy_route" href={`${uiURL}${legacyRoutes.distros}`}>
          Distros
        </a>
      </Menu.Item>
      <Menu.Item>
        <Link to={routes.spawnHost}>Hosts</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`${getUserPatchesRoute(userId)}`}>Patches</Link>
      </Menu.Item>
      <Menu.Divider />
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
