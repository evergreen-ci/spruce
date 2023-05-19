import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { MenuItem } from "@leafygreen-ui/menu";
import { palette } from "@leafygreen-ui/palette";
import { useVersionAnalytics, useTaskAnalytics } from "analytics";
import Icon from "components/Icon";
import Popconfirm from "components/Popconfirm";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY, SET_TASK_PRIORITY } from "gql/mutations";

const { yellow } = palette;

interface SetPriorityProps {
  taskId?: string;
  patchId?: string;
  disabled?: boolean;
  initialPriority?: number;
}

export const SetPriority: React.VFC<SetPriorityProps> = ({
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

  const showWarning = priority > 50;
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
        <Container>
          <TextInput
            ref={(el) => setInputRef(el)}
            data-cy={`${dataCy}-priority-input`}
            icon={
              showWarning ? (
                <Icon glyph="ImportantWithCircle" fill={yellow.base} />
              ) : null
            }
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
            warning={showWarning}
            type="number"
            value={priority.toString()}
          />
          {showWarning && (
            <Warning data-cy="priority-warning">
              Please ensure this is a high priority change.
            </Warning>
          )}
        </Container>
      </Popconfirm>
    </>
  );
};

const Container = styled.div`
  width: 180px;
`;

const TextInput = styled(TextInputWithGlyph)<{ warning: boolean }>`
  input[type="number"] {
    appearance: textfield; // Remove spinners as they conflict with icon.
    ${({ warning }) => warning && `border-color: ${yellow.base};`}
  }
`;

const Warning = styled.p`
  color: ${yellow.base};
`;
