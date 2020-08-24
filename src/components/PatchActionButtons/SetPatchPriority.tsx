import React, { useState } from "react";
import { InputNumber, Popconfirm } from "antd";
import { DropdownItem } from "components/ButtonDropdown";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useBannerDispatchContext } from "context/banners";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";
import { usePatchAnalytics } from "analytics";
import { useMutation } from "@apollo/react-hooks";
import { StyledBody } from "./UnschedulePatchTasks";

interface SetPriorityProps {
  patchId: string;
  disabled: boolean;
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  refetchQueries: string[];
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}

export const SetPatchPriority: React.FC<SetPriorityProps> = ({
  patchId,
  disabled,
  hideMenu,
  refetchQueries,
  setParentLoading,
}) => {
  const priorityRef = React.useRef(null);
  const [priority, setPriority] = useState<number>(0);
  const { successBanner, errorBanner } = useBannerDispatchContext();

  const [setPatchPriority, { loading: loadingSetPatchPriority }] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      successBanner(`Priority was set to ${priority}`);
      setParentLoading(false);
      hideMenu();
    },
    onError: (err) => {
      errorBanner(`Error setting priority: ${err.message}`);
      setParentLoading(false);
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
        setParentLoading(true);
        setPatchPriority({ variables: { patchId, priority } });
        patchAnalytics.sendEvent({ name: "Set Priority", priority });
      }}
      onCancel={hideMenu}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-patch"
        disabled={disabled || loadingSetPatchPriority}
        ref={priorityRef}
      >
        <Disclaimer>Set priority</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};
