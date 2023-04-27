import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import TextInput from "@leafygreen-ui/text-input";
import { useVersionAnalytics } from "analytics";
import Popconfirm from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";

interface SetPriorityProps {
  patchId: string;
  disabled?: boolean;
  refetchQueries?: string[];
}

export const SetPatchPriority: React.VFC<SetPriorityProps> = ({
  patchId,
  disabled,
  refetchQueries = [],
}) => {
  const { sendEvent } = useVersionAnalytics(patchId);
  const dispatchToast = useToastContext();

  const [priority, setPriority] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);

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

  const onConfirm = () => {
    setPatchPriority({ variables: { patchId, priority } });
    sendEvent({ name: "Set Priority", priority });
  };

  useEffect(() => {
    inputRef?.focus();
    inputRef?.select();
  }, [inputRef]);

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy="prioritize-patch"
          disabled={disabled || loadingSetPatchPriority}
          onClick={() => setOpen(!open)}
        >
          Set priority
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        data-cy="set-patch-priority-popconfirm"
        confirmText="Set"
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <TextInput
          ref={(el) => setInputRef(el)}
          data-cy="patch-priority-input"
          label="Set new priority"
          min={-1}
          onChange={(e) => setPriority(parseInt(e.target.value, 10))}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onConfirm();
              setOpen(false);
            }
          }}
          size={16}
          type="number"
          value={priority.toString()}
        />
      </Popconfirm>
    </>
  );
};
