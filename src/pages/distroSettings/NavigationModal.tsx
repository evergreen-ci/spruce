import { matchPath, useParams } from "react-router-dom";
import { NavigationWarningModal } from "components/Settings";
import { getDistroSettingsRoute, routes } from "constants/routes";
import { useHasUnsavedTab } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.FC = () => {
  const { hasUnsaved, unsavedTabs } = useHasUnsavedTab();
  const { distroId } = useParams();

  const shouldConfirmNavigation = ({ nextLocation }): boolean => {
    const isDistroSettingsRoute =
      nextLocation &&
      !!matchPath(`${routes.distroSettings}/*`, nextLocation.pathname);
    if (!isDistroSettingsRoute) {
      return hasUnsaved;
    }

    /* Identify if the user is navigating to a new distro's settings via distro select dropdown */
    const currentDistroRoute = getDistroSettingsRoute(distroId);
    const isNewDistroSettingsRoute = !matchPath(
      `${currentDistroRoute}/*`,
      nextLocation.pathname,
    );
    if (isNewDistroSettingsRoute) {
      return hasUnsaved;
    }

    return false;
  };

  return (
    <NavigationWarningModal
      shouldBlock={shouldConfirmNavigation}
      unsavedTabs={unsavedTabs.map((tab) => ({
        title: getTabTitle(tab).title,
        value: tab,
      }))}
    />
  );
};
