import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useNavbarAnalytics } from "analytics";
import { CURRENT_PROJECT } from "constants/cookies";
import { legacyRoutes } from "constants/externalResources";
import {
  routes,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
} from "constants/routes";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { environmentalVariables } from "utils";
import { Dropdown } from "./NavDropdown";

const { getUiUrl, isNotProduction } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();
  const { sendEvent } = useNavbarAnalytics();
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
      onClick: () => sendEvent({ name: "Click All Hosts Link" }),
    },
    {
      "data-cy": "legacy_route",
      href: `${uiURL}${legacyRoutes.distros}`,
      text: "Distros",
      onClick: () => sendEvent({ name: "Click Distros Link" }),
    },
    {
      "data-cy": "legacy_route",
      href: `${uiURL}${legacyRoutes.projects}`,
      text: "Projects",
      onClick: () => sendEvent({ name: "Click Projects Link" }),
    },
    // TODO: Remove in EVG-17059
    ...(isNotProduction
      ? [
          {
            text: "Project Settings",
            to: getProjectSettingsRoute(mostRecentProject),
            onClick: () => sendEvent({ name: "Click Projects Link" }),
          },
        ]
      : []),
    {
      "data-cy": "auxiliary-dropdown-project-patches",
      to: getProjectPatchesRoute(mostRecentProject),
      text: "Project Patches",
      onClick: () => sendEvent({ name: "Click Project Patches Link" }),
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
