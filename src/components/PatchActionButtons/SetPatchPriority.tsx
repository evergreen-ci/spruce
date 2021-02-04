import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Disclaimer } from "@leafygreen-ui/typography";
import { InputNumber, Popconfirm } from "antd";
import { usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { useBannerDispatchContext } from "context/banners";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";
import { StyledBody } from "./UnschedulePatchTasks";

interface SetPriorityProps {
  patchId: string;
  disabled?: boolean;
  refetchQueries: string[];
}

export const SetPatchPriority: React.FC<SetPriorityProps> = ({
  patchId,
  disabled,
  refetchQueries,
}) => {
  const [priority, setPriority] = useState<number>(0);
  const { successBanner, errorBanner } = useBannerDispatchContext();

  const [setPatchPriority, { loading: loadingSetPatchPriority }] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      successBanner(`Priority was set to ${priority}`);
    },
    onError: (err) => {
      errorBanner(`Error setting priority: ${err.message}`);
    },
    refetchQueries,
  });

  const patchAnalytics = usePatchAnalytics();

  return (
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title={
        <>
          <StyledBody>Set new priority:</StyledBody>
          <InputNumber
            size="small"
            min={0}
            type="number"
            max={Number.MAX_SAFE_INTEGER}
            value={priority}
            onChange={(value) => setPriority(value as number)}
          />
        </>
      }
      onConfirm={() => {
        setPatchPriority({ variables: { patchId, priority } });
        patchAnalytics.sendEvent({ name: "Set Priority", priority });
      }}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-patch"
        disabled={disabled || loadingSetPatchPriority}
      >
        <Disclaimer>Set priority</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};
