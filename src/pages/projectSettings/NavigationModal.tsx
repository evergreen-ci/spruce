import { Body } from "@leafygreen-ui/typography";
import {
  matchPath,
  unstable_useBlocker as useBlocker,
  useParams,
} from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";
import { getProjectSettingsRoute, routes } from "constants/routes";
import { useHasUnsavedTab } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.VFC = () => {
  const { hasUnsaved, unsavedTabs } = useHasUnsavedTab();
  const { projectIdentifier } = useParams();

  const shouldConfirmNavigation = ({ nextLocation }): boolean => {
    const isProjectSettingsRoute =
      nextLocation &&
      !!matchPath(`${routes.projectSettings}/*`, nextLocation.pathname);
    if (!isProjectSettingsRoute) {
      return hasUnsaved;
    }

    /* Identify if the user is navigating to a new project's settings via project select dropdown */
    const currentProjectRoute = getProjectSettingsRoute(projectIdentifier);
    const isNewProjectSettingsRoute = !matchPath(
      `${currentProjectRoute}/*`,
      nextLocation.pathname
    );
    if (isNewProjectSettingsRoute) {
      return hasUnsaved;
    }

    return false;
  };

  const blocker = useBlocker(shouldConfirmNavigation);

  return (
    blocker.state === "blocked" && (
      <ConfirmationModal
        buttonText="Leave"
        data-cy="navigation-warning-modal"
        open
        onCancel={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
        title="You have unsaved changes that will be discarded. Are you sure you want to leave?"
        variant="danger"
      >
        <Body>Unsaved changes are present on the following pages:</Body>
        <ol data-cy="unsaved-pages">
          {unsavedTabs.map((tab) => (
            <li key={tab}>{getTabTitle(tab).title}</li>
          ))}
        </ol>
      </ConfirmationModal>
    )
  );
};
