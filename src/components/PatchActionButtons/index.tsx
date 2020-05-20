import React from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import { InputNumber, Popconfirm } from "antd";
import { DropdownItem } from "components/ButtonDropdown";
import styled from "@emotion/styled";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { PatchRestartModal } from "pages/patch/index";
import { Button } from "components/Button";
import { useBannerDispatchContext } from "context/banners";
import {
  SchedulePatchTasksMutation,
  SchedulePatchTasksMutationVariables,
  UnschedulePatchTasksMutation,
  UnschedulePatchTasksMutationVariables,
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import {
  SCHEDULE_PATCH_TASKS,
  UNSCHEDULE_PATCH_TASKS,
  SET_PATCH_PRIORITY,
} from "gql/mutations";
import { useMutation } from "@apollo/react-hooks";

type PopconfirmButtonClickHandler = (
  e?: React.MouseEvent<HTMLElement, MouseEvent>
) => void;
interface UnscheduleProps {
  onConfirm: PopconfirmButtonClickHandler;
  onCancel: PopconfirmButtonClickHandler;
  onAbortCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  disabled?: boolean;
}
export const UnschedulePatchTasksPopconfirm: React.FC<UnscheduleProps> = ({
  onConfirm,
  onCancel,
  onAbortCheckboxChange,
  checked,
  disabled,
}) => {
  return (
    <Popconfirm
      key="unschedule"
      icon={null}
      placement="left"
      title={
        <>
          <StyledBody>Unschedule all tasks?</StyledBody>
          <Checkbox
            data-cy="abort-checkbox"
            label="Abort tasks that have already started"
            onChange={onAbortCheckboxChange}
            checked={checked}
            bold={false}
          />
        </>
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem disabled={disabled} data-cy="unschedule-patch">
        <Disclaimer>Unschedule All Tasks</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};

interface SchedulePatchTasksProps {
  patchId: string;
  onConfirm: PopconfirmButtonClickHandler;
  onCancel: PopconfirmButtonClickHandler;
  isButton?: boolean;
  refetchQueries?: string[];
}
export const SchedulePatchTasksPopconfirm: React.FC<SchedulePatchTasksProps> = ({
  patchId,
  onConfirm,
  onCancel,
  isButton = false,
  refetchQueries = [],
}) => {
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const [
    schedulePatchTasks,
    { loading: loadingSchedulePatchTasks },
  ] = useMutation<
    SchedulePatchTasksMutation,
    SchedulePatchTasksMutationVariables
  >(SCHEDULE_PATCH_TASKS, {
    variables: { patchId },
    onCompleted: () => {
      successBanner("All tasks were scheduled");
      onCancel();
    },
    onError: (err) => {
      errorBanner(`Error scheduling tasks: ${err.message}`);
      onCancel();
    },
    refetchQueries,
  });

  return (
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title="Schedule all tasks?"
      onConfirm={() => schedulePatchTasks()}
      onCancel={onCancel}
      okText="Yes"
      cancelText="Cancel"
    >
      {isButton ? (
        <Button
          size="small"
          dataCy="schedule-patch"
          disabled={loadingSchedulePatchTasks}
          loading={loadingSchedulePatchTasks}
        >
          Schedule
        </Button>
      ) : (
        <DropdownItem
          disabled={loadingSchedulePatchTasks}
          data-cy="schedule-patch"
        >
          <Disclaimer>Schedule All Tasks</Disclaimer>
        </DropdownItem>
      )}
    </Popconfirm>
  );
};

interface RestartPatchProps {
  disabled: boolean;
  isButton?: boolean;
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  isButton,
  disabled,
}) => {
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <>
      {isButton ? (
        <Button
          size="small"
          dataCy="restart-patch"
          key="restart"
          disabled={disabled}
          loading={false}
          onClick={() => setOpenModal(!openModal)}
        >
          Restart
        </Button>
      ) : (
        <DropdownItem disabled={disabled} data-cy="restart-patch">
          <Disclaimer>Restart</Disclaimer>
        </DropdownItem>
      )}
      <PatchRestartModal
        visible={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
};

interface SetPriorityProps {
  disabled: boolean;
  onConfirm: PopconfirmButtonClickHandler;
  onCancel: PopconfirmButtonClickHandler;
  priority: number;
  setPriority: (value: number) => void;
}
export const SetPatchPriorityPopconfirm: React.FC<SetPriorityProps> = ({
  disabled,
  onConfirm,
  onCancel,
  priority,
  setPriority,
}) => {
  const priorityRef = React.useRef(null);
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
            onChange={setPriority}
          />
        </>
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-patch"
        disabled={disabled}
        ref={priorityRef}
      >
        <Disclaimer>Set priority</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};

const StyledBody = styled(Body)`
  padding-bottom: 8px;
  padding-right: 8px;
`;
