import { legacyRoutes } from "constants/externalResources";
import { routes } from "constants/routes";
import { environmentalVariables } from "utils";
import { Dropdown } from "./Dropdown";

const { getUiUrl } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();

  const menuItems = [
    {
      text: "All Hosts",
      to: routes.hosts,
    },
    {
      "data-cy": "legacy_route",
      href: `${uiURL}${legacyRoutes.distros}`,
      text: "Distros",
    },
    {
      "data-cy": "legacy_route",
      href: `${uiURL}${legacyRoutes.projects}`,
      text: "Projects",
    },
  ];

  return (
    <Dropdown
      dataCy="auxiliary-dropdown-link"
      menuItems={menuItems}
      title="More"
    />
  );
};
