import { useState } from "react";
import { useMutation } from "@apollo/client";
import TextInput from "@leafygreen-ui/text-input";
import { Popconfirm } from "antd";
import { useVersionAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
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

export const SetPatchPriority: React.VFC<SetPriorityProps> = ({
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

  const { sendEvent } = useVersionAnalytics(patchId);

  return (
    <Popconfirm
      key="priority"
      placement="left"
      icon={null}
      title={
        <TextInput
          label="Set new priority"
          value={priority.toString()}
          onChange={(e) => setPriority(parseInt(e.target.value, 10))}
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          size={1}
          autoFocus
          type="number"
          data-cy="priority-input"
        />
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
