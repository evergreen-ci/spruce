import React from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import { InputNumber, Popconfirm } from "antd";
import { DropdownItem } from "components/ButtonDropdown";
import styled from "@emotion/styled";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { PatchRestartModal } from "pages/patch/index";
import { Button } from "components/Button";

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
        <Disclaimer>Unschedule</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};

interface SchedulePatchTasksProps {
  onConfirm: PopconfirmButtonClickHandler;
  onCancel: PopconfirmButtonClickHandler;
  isButton?: boolean;
  loading: boolean;
}
export const SchedulePatchTasksPopconfirm: React.FC<SchedulePatchTasksProps> = ({
  onConfirm,
  onCancel,
  isButton = false,
  loading,
}) => {
  return (
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title="Schedule all tasks?"
      onConfirm={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      cancelText="Cancel"
    >
      {isButton ? (
        <Button
          size="small"
          dataCy="schedule-patch"
          disabled={loading}
          loading={loading}
        >
          Schedule
        </Button>
      ) : (
        <DropdownItem disabled={loading} data-cy="schedule-patch">
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
