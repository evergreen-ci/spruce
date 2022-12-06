import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useNavbarAnalytics } from "analytics";
import { CURRENT_PROJECT } from "constants/cookies";
import { legacyRoutes } from "constants/externalResources";
import {
  routes,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
} from "constants/routes";
import { GetSpruceConfigQuery } from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { environmentalVariables } from "utils";
import { Dropdown } from "./NavDropdown";

const { getUiUrl } = environmentalVariables;

export const AuxiliaryDropdown = () => {
  const uiURL = getUiUrl();
  const { sendEvent } = useNavbarAnalytics();
  const projectCookie = Cookies.get(CURRENT_PROJECT);

  const { data } = useQuery<GetSpruceConfigQuery>(GET_SPRUCE_CONFIG, {
    skip: projectCookie !== undefined,
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
      text: "Project Settings",
      to: getProjectSettingsRoute(mostRecentProject),
      onClick: () => sendEvent({ name: "Click Projects Link" }),
    },
    {
      "data-cy": "auxiliary-dropdown-project-patches",
      to: getProjectPatchesRoute(mostRecentProject),
      text: "Project Patches",
      onClick: () => sendEvent({ name: "Click Project Patches Link" }),
    },
    {
      text: "Task Queue",
      to: getTaskQueueRoute(""),
      onClick: () => sendEvent({ name: "Click Task Queue Link" }),
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
