import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Input } from "antd";
import { usePatchAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { InputLabel } from "components/styles";
import { useToastContext } from "context/toast";
import {
  EnqueuePatchMutation,
  EnqueuePatchMutationVariables,
} from "gql/generated/types";
import { ENQUEUE_PATCH } from "gql/mutations";

const { TextArea } = Input;

interface EnqueueProps {
  patchId: string;
  commitMessage: string;
  visible: boolean;
  onFinished: () => void;
  refetchQueries: string[];
}
export const EnqueuePatchModal: React.FC<EnqueueProps> = ({
  patchId,
  commitMessage,
  visible,
  onFinished,
  refetchQueries,
}) => {
  const dispatchToast = useToastContext();
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

  const patchAnalytics = usePatchAnalytics();

  const [commitMessageValue, setCommitMessageValue] = useState<string>(
    commitMessage || ""
  );

  return (
    <Modal
      title="Enqueue Patch"
      visible={visible}
      onOk={onFinished}
      onCancel={onFinished}
      footer={[
        <Button key="cancel" onClick={onFinished}>
          Cancel
        </Button>,
        <Button
          key="enqueue"
          data-cy="enqueue-patch-button"
          disabled={commitMessageValue.length === 0 || loadingEnqueuePatch}
          onClick={() => {
            onFinished();
            enqueuePatch({
              variables: { patchId, commitMessage: commitMessageValue },
            });
            patchAnalytics.sendEvent({ name: "Enqueue" });
          }}
          variant="primary"
        >
          Enqueue
        </Button>,
      ]}
      data-cy="enqueue-modal"
    >
      <InputLabel htmlFor={COMMIT_MESSAGE_ID}>Commit Message</InputLabel>
      <CommitSquashWarning>
        Warning: submitting a patch to the commit queue will squash the commits.
      </CommitSquashWarning>
      <StyledTextArea
        id={COMMIT_MESSAGE_ID}
        value={commitMessageValue}
        autoSize={{ minRows: 4, maxRows: 6 }}
        onChange={(e) => setCommitMessageValue(e.target.value)}
      />
    </Modal>
  );
};

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;

const CommitSquashWarning = styled.div`
  margin-top: 14px;
`;

const COMMIT_MESSAGE_ID = "commit-message-input";
