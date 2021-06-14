import { Menu } from "antd";
import { Link } from "react-router-dom";
import { legacyRoutes } from "constants/externalResources";
import { routes } from "constants/routes";
import { environmentalVariables } from "utils";
import { Dropdown } from "./Dropdown";

const { getUiUrl } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();

  const menuItems = (
    <Menu>
      <Menu.Item>
        <Link to={routes.hosts}>All Hosts</Link>
      </Menu.Item>
      <Menu.Item>
        <a data-cy="legacy_route" href={`${uiURL}${legacyRoutes.distros}`}>
          Distros
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          data-cy="legacy_route_project"
          href={`${uiURL}${legacyRoutes.projects}`}
        >
          Projects
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      dataCy="auxiliary-dropdown-link"
      menuItems={menuItems}
      title="More"
    />
  );
};
