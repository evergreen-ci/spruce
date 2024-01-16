import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import TextArea from "@leafygreen-ui/text-area";
import { Description, InlineCode } from "@leafygreen-ui/typography";
import { useVersionAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  EnqueuePatchMutation,
  EnqueuePatchMutationVariables,
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import { ENQUEUE_PATCH } from "gql/mutations";
import { CODE_CHANGES } from "gql/queries";
import { commits } from "utils";

const { shouldPreserveCommits } = commits;

interface EnqueueProps {
  patchId: string;
  commitMessage: string;
  visible: boolean;
  onFinished: () => void;
  refetchQueries: string[];
}
export const EnqueuePatchModal: React.FC<EnqueueProps> = ({
  commitMessage,
  onFinished,
  patchId,
  refetchQueries,
  visible,
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useVersionAnalytics(patchId);
  const [commitMessageValue, setCommitMessageValue] = useState<string>(
    commitMessage || "",
  );

  const { data, previousData } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(CODE_CHANGES, {
    variables: { id: patchId },
    skip: !visible,
  });
  const { patch } = data ?? previousData ?? {};
  const { moduleCodeChanges = [] } = patch ?? {};
  const preserveCommits = moduleCodeChanges.length
    ? shouldPreserveCommits(moduleCodeChanges[0].fileDiffs)
    : false;

  const [enqueuePatch, { loading: loadingEnqueuePatch }] = useMutation<
    EnqueuePatchMutation,
    EnqueuePatchMutationVariables
  >(ENQUEUE_PATCH, {
    onCompleted: () => {
      dispatchToast.success(`Enqueued patch`);
    },
    onError: (err) => {
      dispatchToast.error(`Error enqueueing patch: ${err.message}`);
    },
    refetchQueries,
  });

  const onConfirm = () => {
    enqueuePatch({
      variables: { patchId, commitMessage: commitMessageValue },
    });
    sendEvent({ name: "Enqueue" });
    onFinished();
  };

  return (
    <ConfirmationModal
      title="Enqueue Patch"
      open={visible}
      onConfirm={onConfirm}
      onCancel={onFinished}
      buttonText="Enqueue"
      submitDisabled={commitMessageValue.length === 0 || loadingEnqueuePatch}
      data-cy="enqueue-modal"
    >
      {preserveCommits ? (
        <Description>
          This patch was created with the{" "}
          <InlineCode>--preserve-commits</InlineCode> option. All commits will
          be preserved when merging.
        </Description>
      ) : (
        <StyledTextArea
          id={COMMIT_MESSAGE_ID}
          label="Commit Message"
          description="Warning: submitting a patch to the commit queue will squash the commits."
          value={commitMessageValue}
          onChange={(e) => setCommitMessageValue(e.target.value)}
        />
      )}
    </ConfirmationModal>
  );
};

const StyledTextArea = styled(TextArea)`
  & p {
    margin-bottom: ${size.s};
  }
`;

const COMMIT_MESSAGE_ID = "commit-message-input";
