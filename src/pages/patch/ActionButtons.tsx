import React, { useRef, useState, useEffect } from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import { Button } from "components/Button";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { InputNumber, Popconfirm } from "antd";
import { useMutation } from "@apollo/react-hooks";
import { Body } from "@leafygreen-ui/typography";
import { PageButtonRow } from "components/styles";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { PatchRestartModal } from "pages/patch/index";
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

export const ActionButtons = () => {
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const wrapperRef = useRef(null);
  const priorityRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [abort, setAbort] = useState(false);
  const initialPriority = 1;
  const [priority, setPriority] = useState<number>(initialPriority);
  const { id: patchId } = useParams<{ id: string }>();

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
    },
    onError: (err) => {
      errorBanner(`Error scheduling tasks: ${err.message}`);
    },
    refetchQueries,
  });

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

  const [setPatchPriority, { loading: loadingSetPatchPriority }] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      successBanner(`Priority was set to ${priority}`);
      setPriority(initialPriority);
    },
    onError: (err) => {
      errorBanner(`Error setting priority: ${err.message}`);
    },
    refetchQueries,
  });

  const disabled =
    loadingSchedulePatchTasks ||
    loadingSetPatchPriority ||
    loadingUnschedulePatchTasks;

  useEffect(() => {
    if (disabled) {
      setIsVisible(false);
    }
  }, [disabled, setIsVisible]);

  const dropdownItems = [
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
      onCancel={() => setIsVisible(false)}
      okText="Yes"
      cancelText="Cancel"
    >
      <DropdownItem disabled={disabled} data-cy="unschedule-patch">
        <Body>Unschedule</Body>
      </DropdownItem>
    </Popconfirm>,
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
      onConfirm={() => setPatchPriority({ variables: { patchId, priority } })}
      onCancel={() => setIsVisible(false)}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-patch"
        disabled={disabled}
        ref={priorityRef}
      >
        <Body>Set priority</Body>
      </DropdownItem>
    </Popconfirm>,
  ];

  return (
    <>
      <PageButtonRow ref={wrapperRef}>
        <Popconfirm
          key="priority"
          icon={null}
          placement="left"
          title="Schedule all tasks?"
          onConfirm={() => schedulePatchTasks()}
          onCancel={() => setIsVisible(false)}
          okText="Yes"
          cancelText="Cancel"
        >
          <Button
            size="small"
            dataCy="schedule-patch"
            disabled={disabled}
            loading={loadingSchedulePatchTasks}
          >
            Schedule
          </Button>
        </Popconfirm>
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
        <Button
          size="small"
          dataCy="notify-patch"
          key="notifications"
          disabled={disabled}
        >
          Notify Me
        </Button>
        <ButtonDropdown
          disabled={disabled}
          dropdownItems={dropdownItems}
          isVisibleDropdown={isVisible}
          setIsVisibleDropdown={setIsVisible}
          loading={false}
        />
      </PageButtonRow>
      <PatchRestartModal
        visible={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      />
    </>
  );
};

const refetchQueries = ["Patch"];

const StyledBody = styled(Body)`
  padding-bottom: 8px;
  padding-right: 8px;
`;
