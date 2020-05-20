import React, { useState } from "react";
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
  // SetPatchPriorityMutation,
  // SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import {
  SCHEDULE_PATCH_TASKS,
  UNSCHEDULE_PATCH_TASKS,
  // SET_PATCH_PRIORITY,
} from "gql/mutations";
import { useMutation } from "@apollo/react-hooks";

type PopconfirmButtonClickHandler = (
  e?: React.MouseEvent<HTMLElement, MouseEvent>
) => void;
interface UnscheduleProps {
  patchId: string;
  hideMenu: PopconfirmButtonClickHandler;
  refetchQueries?: string[];
}
export const UnschedulePatchTasksPopconfirm: React.FC<UnscheduleProps> = ({
  patchId,
  hideMenu,
  refetchQueries,
}) => {
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const [abort, setAbort] = useState(false);
  const [
    unschedulePatchTasks,
    { loading: loadingUnschedulePatchTasks },
  ] = useMutation<
    UnschedulePatchTasksMutation,
    UnschedulePatchTasksMutationVariables
  >(UNSCHEDULE_PATCH_TASKS, {
    onCompleted: () => {
      successBanner(
        `All tasks were unscheduled ${
          abort ? "and tasks that already started were aborted" : ""
        }`
      );
      setAbort(false);
    },
    onError: (err) => {
      errorBanner(`Error unscheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

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
            onChange={() => setAbort(!abort)}
            checked={abort}
            bold={false}
          />
        </>
      }
      onConfirm={() => unschedulePatchTasks({ variables: { patchId, abort } })}
      onCancel={hideMenu}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem
        disabled={loadingUnschedulePatchTasks}
        data-cy="unschedule-patch"
      >
        <Disclaimer>Unschedule All Tasks</Disclaimer>
      </DropdownItem>
    </Popconfirm>
  );
};

interface SchedulePatchTasksProps {
  patchId: string;
  hideMenu: PopconfirmButtonClickHandler;
  isButton?: boolean;
  refetchQueries?: string[];
}
export const SchedulePatchTasksPopconfirm: React.FC<SchedulePatchTasksProps> = ({
  patchId,
  hideMenu,
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
      hideMenu();
    },
    onError: (err) => {
      errorBanner(`Error scheduling tasks: ${err.message}`);
      hideMenu();
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
      onCancel={hideMenu}
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
  patchId: string;
  disabled: boolean;
  isButton?: boolean;
  refetchQueries?: string[];
  hideMenu: PopconfirmButtonClickHandler;
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  isButton,
  disabled,
  patchId,
  refetchQueries,
  hideMenu,
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
        <DropdownItem
          disabled={disabled}
          data-cy="restart-patch"
          onClick={() => setOpenModal(!openModal)}
        >
          <Disclaimer>Restart</Disclaimer>
        </DropdownItem>
      )}
      {openModal && (
        <PatchRestartModal
          patchId={patchId}
          visible={openModal}
          onOk={() => {
            setOpenModal(false);
            hideMenu();
          }}
          onCancel={() => setOpenModal(false)}
          refetchQueries={refetchQueries}
        />
      )}
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
