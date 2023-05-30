import { Body } from "@leafygreen-ui/typography";
import { matchPath, unstable_useBlocker as useBlocker } from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";
import { routes } from "constants/routes";
import { useHasUnsavedTab } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.VFC = () => {
  const { hasUnsaved, unsavedTabs } = useHasUnsavedTab();

  const shouldConfirmNavigation = ({ nextLocation }): boolean => {
    const isProjectSettingsRoute =
      nextLocation &&
      !!matchPath(`${routes.projectSettings}/*`, nextLocation.pathname);
    return !isProjectSettingsRoute && hasUnsaved;
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
