import { useNavbarAnalytics } from "analytics";
import {
  routes,
  getDistroSettingsRoute,
  getProjectPatchesRoute,
  getProjectSettingsRoute,
  getTaskQueueRoute,
  getCommitQueueRoute,
} from "constants/routes";
import { useFirstDistro } from "hooks";
import { NavDropdown } from "./NavDropdown";

interface AuxiliaryDropdownProps {
  projectIdentifier: string;
}

export const AuxiliaryDropdown: React.FC<AuxiliaryDropdownProps> = ({
  projectIdentifier,
}) => {
  const { sendEvent } = useNavbarAnalytics();
  const { distro } = useFirstDistro();

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
      "data-cy": "auxiliary-dropdown-distro-settings",
      to: getDistroSettingsRoute(distro),
      text: "Distro Settings",
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
