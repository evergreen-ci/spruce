import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { MenuItem } from "@leafygreen-ui/menu";
import { NumberInput } from "@leafygreen-ui/number-input";
import { palette } from "@leafygreen-ui/palette";
import { useVersionAnalytics, useTaskAnalytics } from "analytics";
import Icon from "components/Icon";
import Popconfirm from "components/Popconfirm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY, SET_TASK_PRIORITY } from "gql/mutations";

const { yellow } = palette;

type SetPriorityProps = (
  | {
      patchId: string;
      taskId?: never;
    }
  | {
      taskId: string;
      patchId?: never;
    }
) & {
  initialPriority?: number;
  disabled?: boolean;
};

const SetPriority: React.VFC<SetPriorityProps> = ({
  taskId,
  patchId,
  disabled,
  initialPriority = 0,
}) => {
  const { sendEvent: sendPatchEvent } = useVersionAnalytics(patchId);
  const { sendEvent: sendTaskEvent } = useTaskAnalytics();
  const dispatchToast = useToastContext();

  const [priority, setPriority] = useState<number>(initialPriority);
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
  });

  const [setTaskPriority, { loading: loadingSetTaskPriority }] = useMutation<
    SetTaskPriorityMutation,
    SetTaskPriorityMutationVariables
  >(SET_TASK_PRIORITY, {
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
  });

  const onConfirm = () => {
    if (taskId) {
      setTaskPriority({ variables: { taskId, priority } });
      sendTaskEvent({ name: "Set Priority", priority });
    } else {
      setPatchPriority({ variables: { patchId, priority } });
      sendPatchEvent({ name: "Set Priority", priority });
    }
  };

  useEffect(() => {
    inputRef?.focus();
    inputRef?.select();
  }, [inputRef]);

  const dataCy = taskId ? "task" : "patch";

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy={`prioritize-${dataCy}`}
          disabled={
            disabled || loadingSetPatchPriority || loadingSetTaskPriority
          }
          onClick={() => setOpen(!open)}
        >
          Set priority
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        data-cy={`set-${dataCy}-priority-popconfirm`}
        confirmText="Set"
        onConfirm={onConfirm}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <PriorityInput
          ref={(el) => setInputRef(el)}
          data-cy={`${dataCy}-priority-input`}
          inputClassName="priority-input"
          label="Set new priority"
          min={-1}
          onChange={(e) => setPriority(parseInt(e.target.value, 10))}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onConfirm();
              setOpen(false);
            }
          }}
          value={priority.toString()}
        />
        {priority > 50 && (
          <Warning data-cy="priority-warning">
            <WarningIcon glyph="ImportantWithCircle" fill={yellow.base} />
            <span>Please ensure that this is a high priority change.</span>
          </Warning>
        )}
      </Popconfirm>
    </>
  );
};

const inputWidth = "180px";

const PriorityInput = styled(NumberInput)`
  .priority-input {
    width: ${inputWidth};
  }
`;

const Warning = styled.div`
  width: ${inputWidth};
  display: flex;
  align-items: flex-start;
  gap: ${size.xxs};
  margin-top: ${size.xxs};
  color: ${yellow.base};
`;

const WarningIcon = styled(Icon)`
  flex-shrink: 0;
  margin-top: 2px;
`;

export default SetPriority;
