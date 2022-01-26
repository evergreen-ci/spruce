import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { CURRENT_PROJECT } from "constants/cookies";
import { legacyRoutes } from "constants/externalResources";
import { routes, getProjectPatchesRoute } from "constants/routes";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { environmentalVariables } from "utils";
import { Dropdown } from "./Dropdown";

const { getUiUrl } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();
  const projectCookie = Cookies.get(CURRENT_PROJECT);

  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG, {
    skip: !!projectCookie,
  });

  const mostRecentProject =
    projectCookie || data?.spruceConfig?.ui?.defaultProject;

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
    {
      "data-cy": "auxiliary-dropdown-project-patches",
      to: getProjectPatchesRoute(mostRecentProject),
      text: "Project Patches",
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
