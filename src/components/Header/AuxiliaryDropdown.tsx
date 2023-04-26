import { useNavbarAnalytics } from "analytics";
import { legacyRoutes } from "constants/externalResources";
import {
  routes,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
  getCommitQueueRoute,
} from "constants/routes";
import { environmentVariables } from "utils";
import { NavDropdown } from "./NavDropdown";

const { getUiUrl } = environmentVariables;

interface AuxiliaryDropdownProps {
  projectIdentifier: string;
}

export const AuxiliaryDropdown: React.VFC<AuxiliaryDropdownProps> = ({
  projectIdentifier,
}) => {
  const uiURL = getUiUrl();
  const { sendEvent } = useNavbarAnalytics();

  const menuItems = [
    {
      text: "All Hosts",
      to: routes.hosts,
      onClick: () => sendEvent({ name: "Click All Hosts Link" }),
    },
    {
      text: "Commit Queue",
      to: getCommitQueueRoute(projectIdentifier),
      onClick: () => sendEvent({ name: "Click Commit Queue Link" }),
    },
    {
      text: "Task Queue",
      to: getTaskQueueRoute(""),
      onClick: () => sendEvent({ name: "Click Task Queue Link" }),
    },
    {
      "data-cy": "legacy_route",
      href: `${uiURL}${legacyRoutes.distros}`,
      text: "Distros",
      onClick: () => sendEvent({ name: "Click Distros Link" }),
    },

    {
      "data-cy": "auxiliary-dropdown-project-patches",
      to: getProjectPatchesRoute(projectIdentifier),
      text: "Project Patches",
      onClick: () => sendEvent({ name: "Click Project Patches Link" }),
    },
    {
      "data-cy": "auxiliary-dropdown-project-settings",
      text: "Project Settings",
      to: getProjectSettingsRoute(projectIdentifier),
      onClick: () => sendEvent({ name: "Click Projects Link" }),
    },
  ];

  return (
    <NavDropdown
      dataCy="auxiliary-dropdown-link"
      menuItems={menuItems}
      title="More"
    />
  );
};
