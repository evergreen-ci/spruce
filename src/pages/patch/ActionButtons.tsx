import React, { useRef, useState, useEffect } from "react";
import { Button } from "components/Button";
import styled from "@emotion/styled";
import { useOnClickOutside } from "hooks";
import { InputNumber, Popconfirm } from "antd";
import get from "lodash/get";
import { Body } from "@leafygreen-ui/typography";
import { PageButtonRow } from "components/styles";
import { DropdownItem, ButtonDropdown } from "components/ButtonDropdown";
import { PatchRestartModal } from "pages/patch/index";

interface Props {
  initialPriority?: number;
  canAbort: boolean;
  canRestart: boolean;
  canSchedule: boolean;
  canUnschedule: boolean;
  canSetPriority: boolean;
}

export const ActionButtons = ({
  canAbort,
  canRestart,
  canSchedule,
  canSetPriority,
  canUnschedule,
  initialPriority,
}: Props) => {
  const wrapperRef = useRef(null);
  const priorityRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [priority, setPriority] = useState<number>(initialPriority);

  const disabled = false;

  useEffect(() => {
    if (disabled) {
      setIsVisible(false);
    }
  }, [disabled, setIsVisible]);

  useOnClickOutside(wrapperRef, () => {
    if (
      !get(priorityRef, "current.className", "").includes("ant-popover-open")
    ) {
      setIsVisible(false);
    }
  });

  const dropdownItems = [
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title="Unschedule version?"
      onConfirm={() => undefined}
      onCancel={() => setIsVisible(false)}
      okText="Ok"
      cancelText="Cancel"
    >
      <DropdownItem
        disabled={disabled || !canUnschedule}
        key="unschedule"
        data-cy="unschedule-task"
        onClick={() => undefined}
      >
        <Body>Unschedule</Body>
      </DropdownItem>
    </Popconfirm>,
    <Popconfirm
      key="priority"
      icon={null}
      placement="left"
      title="Abort version?"
      onConfirm={() => undefined}
      onCancel={() => setIsVisible(false)}
      okText="Ok"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="abort-task"
        key="abort"
        disabled={disabled || !canAbort}
        onClick={() => undefined}
      >
        <Body>Abort</Body>
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
      onConfirm={() => undefined}
      onCancel={() => setIsVisible(false)}
      okText="Set"
      cancelText="Cancel"
    >
      <DropdownItem
        data-cy="prioritize-task"
        disabled={disabled || !canSetPriority}
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
          title="Schedule version?"
          onConfirm={() => undefined}
          onCancel={() => setIsVisible(false)}
          okText="Ok"
          cancelText="Cancel"
        >
          <Button
            size="small"
            dataCy="schedule-patch"
            key="schedule"
            disabled={disabled || !canSchedule}
            loading={false}
            onClick={() => undefined}
          >
            Schedule
          </Button>
        </Popconfirm>
        <Button
          size="small"
          dataCy="restart-patch"
          key="restart"
          disabled={disabled || !canRestart}
          loading={false}
          onClick={() => setOpenModal(!openModal)}
        >
          Restart
        </Button>
        <Button
          size="small"
          dataCy="notify-task"
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

const StyledBody = styled(Body)`
  padding-right: 8px;
`;
