import React from "react";
import { useMutation } from "@apollo/client";
import { Popconfirm } from "antd";
import { usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useBannerDispatchContext } from "context/banners";
import {
  EnqueuePatchMutation,
  EnqueuePatchMutationVariables,
} from "gql/generated/types";
import { ENQUEUE_PATCH } from "gql/mutations";
import { StyledBody } from "./UnschedulePatchTasks";

interface EnqueueProps {
  patchId: string;
  disabled: boolean;
  refetchQueries: string[];
}
export const EnqueuePatch: React.FC<EnqueueProps> = ({
  patchId,
  disabled,
  refetchQueries,
}) => {
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

  return (
    <ConditionalWrapper
      condition={!disabled || !loadingEnqueuePatch}
      wrapper={(children) => (
        <Popconfirm
          key="enqueue"
          icon={null}
          placement="left"
          title={<StyledBody>Enqueue patch on the commit queue?</StyledBody>}
          onConfirm={() => {
            enqueuePatch({ variables: { patchId } });
            patchAnalytics.sendEvent({ name: "Enqueue" });
          }}
          okText="Yes"
          cancelText="Cancel"
        >
          {children}
        </Popconfirm>
      )}
    >
      <DropdownItem
        data-cy="enqueue-patch"
        disabled={disabled || loadingEnqueuePatch}
      >
        Add to commit queue
      </DropdownItem>
    </ConditionalWrapper>
  );
};
