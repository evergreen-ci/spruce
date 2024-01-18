import { useMutation } from "@apollo/client";
import { useProjectSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { useToastContext } from "context/toast";
import {
  AttachProjectToRepoMutation,
  AttachProjectToRepoMutationVariables,
  DetachProjectFromRepoMutation,
  DetachProjectFromRepoMutationVariables,
} from "gql/generated/types";
import {
  ATTACH_PROJECT_TO_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";

type ModalProps = {
  handleClose: () => void;
  open: boolean;
  projectId: string;
  repoName: string;
  repoOwner: string;
  shouldAttach: boolean;
};

export const AttachDetachModal: React.FC<ModalProps> = ({
  handleClose,
  open,
  projectId,
  repoName,
  repoOwner,
  shouldAttach,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useProjectSettingsAnalytics();

  const [attachProjectToRepo] = useMutation<
    AttachProjectToRepoMutation,
    AttachProjectToRepoMutationVariables
  >(ATTACH_PROJECT_TO_REPO, {
    variables: { projectId },
    onCompleted() {
      dispatchToast.success("Successfully attached to repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error attaching the project: ${err.message}`,
      );
    },
    refetchQueries: [
      "ProjectSettings",
      "RepoSettings",
      "ViewableProjectRefs",
      "GithubProjectConflicts",
    ],
  });

  const [detachProjectFromRepo] = useMutation<
    DetachProjectFromRepoMutation,
    DetachProjectFromRepoMutationVariables
  >(DETACH_PROJECT_FROM_REPO, {
    variables: { projectId },
    onCompleted() {
      dispatchToast.success("Successfully detached from repo");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error detaching the project: ${err.message}`,
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings", "ViewableProjectRefs"],
  });

  return (
    <ConfirmationModal
      buttonText={shouldAttach ? "Attach" : "Detach"}
      data-cy="attach-repo-modal"
      onCancel={handleClose}
      onConfirm={() => {
        if (shouldAttach) {
          attachProjectToRepo();
          sendEvent({ name: "Attach project to repo", repoOwner, repoName });
        } else {
          detachProjectFromRepo();
          sendEvent({ name: "Detach project from repo", repoOwner, repoName });
        }
        handleClose();
      }}
      open={open}
      title={`Are you sure you want to ${
        shouldAttach ? "attach to" : "detach from"
      } ${repoOwner}/${repoName}?`}
      variant="danger"
    >
      {shouldAttach ? (
        <>
          Attaching to repo means that for each project setting, users will have
          the option of using the value defined at the repo level instead of
          setting it individually for this branch.
        </>
      ) : (
        <>
          Detaching means that this branch will no longer use defaults defined
          at the repo level. For any settings that are currently using the
          default, the current state will be saved to this branch, but
          repo-level settings will not be considered in the future.
        </>
      )}
    </ConfirmationModal>
  );
};
