import { matchPath } from "react-router";
import NavigationPrompt from "react-router-navigation-prompt";
import { ConfirmationModal } from "components/ConfirmationModal";
import { routes } from "constants/routes";
import { useIsAnyTabUnsaved } from "./Context";
import { getTabTitle } from "./getTabTitle";

export const NavigationModal: React.VFC = () => {
  const { hasUnsaved, unsavedTabs } = useIsAnyTabUnsaved();

  const shouldConfirmNavigation = (currentLocation, nextLocation): boolean => {
    const isProjectSettingsRoute =
      nextLocation &&
      matchPath(nextLocation.pathname, {
        path: routes.projectSettings,
      });
    return !isProjectSettingsRoute && hasUnsaved;
  };

  return (
    <NavigationPrompt disableNative when={shouldConfirmNavigation}>
      {({ onConfirm, onCancel }) => (
        <ConfirmationModal
          buttonText="Leave"
          data-cy="navigation-warning-modal"
          open
          onCancel={onCancel}
          onConfirm={onConfirm}
          title="You have unsaved changes that will be discarded. Are you sure you want to leave?"
          variant="danger"
        >
          <p>Unsaved changes are present on the following pages:</p>
          <ol>
            {unsavedTabs.map((tab) => (
              <li key={tab}>{getTabTitle(tab).title}</li>
            ))}
          </ol>
        </ConfirmationModal>
      )}
    </NavigationPrompt>
  );
};
