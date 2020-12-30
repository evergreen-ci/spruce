import React, { forwardRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Popconfirm, Input } from "antd";
import { usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
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
  disabled: boolean;
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  refetchQueries: string[];
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}
export const EnqueuePatch = forwardRef<HTMLDivElement, EnqueueProps>(
  (
    {
      patchId,
      commitMessage,
      disabled,
      hideMenu,
      refetchQueries,
      setParentLoading = () => undefined,
    },
    ref
  ) => {
    const { successBanner, errorBanner } = useBannerDispatchContext();

    const [enqueuePatch, { loading: loadingEnqueuePatch }] = useMutation<
      EnqueuePatchMutation,
      EnqueuePatchMutationVariables
    >(ENQUEUE_PATCH, {
      onCompleted: () => {
        successBanner(`Enqueued patch`);
        setParentLoading(false);
        hideMenu();
      },
      onError: (err) => {
        errorBanner(`Error enqueueing patch: ${err.message}`);
        setParentLoading(false);
      },
      refetchQueries,
    });

    const patchAnalytics = usePatchAnalytics();

    const [commitMessageValue, setCommitMessageValue] = useState<string>(
      commitMessage || ""
    );

    return (
      <Popconfirm
        key="enqueue"
        icon={null}
        placement="left"
        title={
          <>
            <InputLabel htmlFor={COMMIT_MESSAGE_ID}>Commit Message</InputLabel>
            <StyledTextArea
              id={COMMIT_MESSAGE_ID}
              value={commitMessageValue}
              autoSize={{ minRows: 4, maxRows: 6 }}
              onChange={(e) => setCommitMessageValue(e.target.value)}
            />
          </>
        }
        onConfirm={() => {
          setParentLoading(true);
          enqueuePatch({ variables: { patchId, commitMessage } });
          patchAnalytics.sendEvent({ name: "Enqueue" });
        }}
        onCancel={hideMenu}
        okText="Yes"
        cancelText="Cancel"
      >
        <DropdownItem
          data-cy="enqueue-patch"
          disabled={disabled || loadingEnqueuePatch}
          ref={ref}
        >
          <Disclaimer>Add to commit queue</Disclaimer>
        </DropdownItem>
      </Popconfirm>
    );
  }
);

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;

const COMMIT_MESSAGE_ID = "commit-message-input";
