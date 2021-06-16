import { legacyRoutes } from "constants/externalResources";
import { routes } from "constants/routes";
import { environmentalVariables } from "utils";
import { DropdownItem, Dropdown } from "./Dropdown";

const { getUiUrl } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();

  return (
    <Dropdown dataCy="auxiliary-dropdown-link" title="More">
      <DropdownItem to={routes.hosts}>All Hosts</DropdownItem>
      <DropdownItem
        data-cy="legacy_route"
        href={`${uiURL}${legacyRoutes.distros}`}
      >
        Distros
      </DropdownItem>
      <DropdownItem
        data-cy="legacy_route_project"
        href={`${uiURL}${legacyRoutes.projects}`}
      >
        Projects
      </DropdownItem>
    </Dropdown>
  );
};
