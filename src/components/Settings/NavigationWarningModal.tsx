import { Body } from "@leafygreen-ui/typography";
import {
  unstable_BlockerFunction as BlockerFunction,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";

type Props = {
  shouldConfirmNavigation: BlockerFunction;
  unsavedTabs: Array<{
    title: string;
    value: string;
  }>;
};

export const NavigationWarningModal: React.VFC<Props> = ({
  shouldConfirmNavigation,
  unsavedTabs,
}) => {
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
          {unsavedTabs.map(({ title, value }) => (
            <li key={value}>{title}</li>
          ))}
        </ol>
      </ConfirmationModal>
    )
  );
};
