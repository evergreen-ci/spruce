import { useEffect, useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import TextInput from "@leafygreen-ui/text-input";
import { useTaskAnalytics } from "analytics";
import Popconfirm from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
} from "gql/generated/types";
import { SET_TASK_PRIORTY } from "gql/mutations";

interface SetTaskPriorityProps {
  taskId: string;
  initialPriority: number;
  disabled?: boolean;
  refetchQueries?: string[];
}

export const SetTaskPriority: React.VFC<SetTaskPriorityProps> = ({
  taskId,
  initialPriority,
  disabled,
  refetchQueries = [],
}) => {
  const { sendEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [priority, setPriority] = useState<number>(initialPriority);
  const [active, setActive] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [setTaskPriority, { loading: loadingSetPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORTY, {
    onCompleted: (data) => {
      dispatchToast.success(
        data.setTaskPriority.priority >= 0
          ? `Priority for task updated to ${data.setTaskPriority.priority}`
          : `Task was successfully disabled`
      );
    },
    onError: (err) => {
      dispatchToast.error(`Error updating priority for task: ${err.message}`);
    },
    refetchQueries,
  });

  const onConfirm = () => {
    setTaskPriority({
      variables: { taskId, priority },
    });
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
          active={active}
          data-cy="prioritize-task"
          disabled={disabled || loadingSetPriority}
          onClick={() => setActive(!active)}
        >
          Set priority
        </MenuItem>
      </div>
      <Popconfirm
        open={active}
        data-cy="set-task-priority-popconfirm"
        align="left"
        refEl={menuItemRef}
        confirmText="Set"
        onConfirm={onConfirm}
        setOpen={setActive}
      >
        <TextInput
          ref={(el) => setInputRef(el)}
          data-cy="task-priority-input"
          label="Set new priority"
          min={-1}
          onChange={(e) => setPriority(parseInt(e.target.value, 10))}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onConfirm();
              setActive(false);
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
