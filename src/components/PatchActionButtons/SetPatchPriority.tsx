import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { InputNumber, Popconfirm } from "antd";
import { useVersionAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";

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
  const dispatchToast = useToastContext();
  const [setPatchPriority, { loading: loadingSetPatchPriority }] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      dispatchToast.success(`Priority was set to ${priority}`);
    },
    onError: (err) => {
      dispatchToast.error(`Error setting priority: ${err.message}`);
    },
    refetchQueries,
  });

  const { sendEvent } = useVersionAnalytics();

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
            data-cy="priority-input"
          />
        </>
      }
      onConfirm={() => {
        setPatchPriority({ variables: { patchId, priority } });
        sendEvent({ name: "Set Priority", priority });
      }}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-patch"
        disabled={disabled || loadingSetPatchPriority}
      >
        Set priority
      </DropdownItem>
    </Popconfirm>
  );
};

const StyledBody = styled(Body)`
  padding-bottom: ${size.xs};
  padding-right: ${size.xs};
`;
