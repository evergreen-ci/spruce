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
      onClick: () => sendEvent({ name: "Click All Hosts Link" }),
      text: "All Hosts",
      to: routes.hosts,
    },
    {
      onClick: () => sendEvent({ name: "Click Commit Queue Link" }),
      text: "Commit Queue",
      to: getCommitQueueRoute(projectIdentifier),
    },
    {
      onClick: () => sendEvent({ name: "Click Task Queue Link" }),
      text: "Task Queue",
      to: getTaskQueueRoute(""),
    },
    {
      "data-cy": "legacy_route",
      href: `${uiURL}${legacyRoutes.distros}`,
      onClick: () => sendEvent({ name: "Click Distros Link" }),
      text: "Distros",
    },

    {
      "data-cy": "auxiliary-dropdown-project-patches",
      onClick: () => sendEvent({ name: "Click Project Patches Link" }),
      text: "Project Patches",
      to: getProjectPatchesRoute(projectIdentifier),
    },
    {
      "data-cy": "auxiliary-dropdown-project-settings",
      onClick: () => sendEvent({ name: "Click Projects Link" }),
      text: "Project Settings",
      to: getProjectSettingsRoute(projectIdentifier),
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
