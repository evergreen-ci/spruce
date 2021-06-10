import { Menu } from "antd";
import { legacyRoutes } from "constants/externalResources";
import { environmentalVariables } from "utils";
import { Dropdown } from "./Dropdown";

const { getUiUrl } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();

  const menuItems = (
    <Menu>
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

  return <Dropdown menuItems={menuItems} title="More" />;
};
