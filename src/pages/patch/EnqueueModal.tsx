import React, { forwardRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Input } from "antd";
import { usePatchAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
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
  onOk: () => void;
  onCancel: () => void;
  refetchQueries: string[];
}
export const EnqueuePatchModal = forwardRef<HTMLDivElement, EnqueueProps>(
  ({ patchId, commitMessage, visible, onOk, onCancel, refetchQueries }) => {
    const { successBanner, errorBanner } = useBannerDispatchContext();

    const [enqueuePatch, { loading: loadingEnqueuePatch }] = useMutation<
      EnqueuePatchMutation,
      EnqueuePatchMutationVariables
    >(ENQUEUE_PATCH, {
      onCompleted: () => {
        successBanner(`Enqueued patch`);
      },
      onError: (err) => {
        errorBanner(`Error enqueueing patch: ${err.message}`);
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
        onOk={onOk}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="enqueue"
            disabled={commitMessageValue.length === 0 || loadingEnqueuePatch}
            onClick={() => {
              enqueuePatch({ variables: { patchId, commitMessage } });
              patchAnalytics.sendEvent({ name: "Enqueue" });
            }}
            variant="primary"
          >
            Enqueue
          </Button>,
        ]}
        data-cy="enqueue-modal"
      >
        <>
          <InputLabel htmlFor={COMMIT_MESSAGE_ID}>Commit Message</InputLabel>
          <StyledTextArea
            id={COMMIT_MESSAGE_ID}
            value={commitMessageValue}
            autoSize={{ minRows: 4, maxRows: 6 }}
            onChange={(e) => setCommitMessageValue(e.target.value)}
          />
        </>
      </Modal>
    );
  }
);

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;

const COMMIT_MESSAGE_ID = "commit-message-input";
