import React, { useRef, useState, useEffect } from "react";
import { Button } from "components/Button";
import { useParams } from "react-router-dom";
import { PageButtonRow } from "components/styles";
import { ButtonDropdown } from "components/ButtonDropdown";
import {
  SchedulePatchTasks,
  RestartPatch,
  UnschedulePatchTasks,
  SetPatchPriority,
} from "components/PatchActionButtons";

export const ActionButtons = () => {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { id: patchId } = useParams<{ id: string }>();

  const [actionIsLoading, setActionIsLoading] = useState(false);

  const hideMenu = () => setIsVisible(false);

  useEffect(() => {
    if (actionIsLoading) {
      setIsVisible(false);
    }
  }, [actionIsLoading, setIsVisible]);

  const dropdownItems = [
    <UnschedulePatchTasks
      {...{
        patchId,
        hideMenu,
        refetchQueries,
        key: "unschedule",
        setParentLoading: setActionIsLoading,
        disabled: actionIsLoading,
      }}
    />,
    <SetPatchPriority
      {...{
        patchId,
        hideMenu,
        key: "priority",
        disabled: actionIsLoading,
        refetchQueries,
        setParentLoading: setActionIsLoading,
      }}
    />,
  ];

  return (
    <>
      <PageButtonRow ref={wrapperRef}>
        <SchedulePatchTasks
          {...{
            patchId,
            hideMenu,
            isButton: true,
            disabled: actionIsLoading,
            setParentLoading: setActionIsLoading,
            refetchQueries,
          }}
        />
        <RestartPatch
          {...{ patchId, hideMenu, isButton: true, disabled: actionIsLoading }}
        />
        <Button
          size="small"
          dataCy="notify-patch"
          key="notifications"
          disabled={actionIsLoading}
        >
          Notify Me
        </Button>
        <ButtonDropdown
          disabled={actionIsLoading}
          dropdownItems={dropdownItems}
          isVisibleDropdown={isVisible}
          setIsVisibleDropdown={setIsVisible}
          loading={false}
        />
      </PageButtonRow>
    </>
  );
};

const refetchQueries = ["Patch"];
