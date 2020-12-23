import React, { useRef, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { ButtonDropdown, DropdownItem } from "components/ButtonDropdown";
import { LinkToReconfigurePage } from "components/LinkToReconfigurePage";
import {
  SchedulePatchTasks,
  RestartPatch,
  UnschedulePatchTasks,
  SetPatchPriority,
  EnqueuePatch,
  AddNotification,
} from "components/PatchActionButtons";
import { PageButtonRow } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";

interface ActionButtonProps {
  canEnqueueToCommitQueue: boolean;
  isPatchOnCommitQueue: boolean;
}

export const ActionButtons: React.FC<ActionButtonProps> = ({
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
}) => {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { id: patchId } = useParams<{ id: string }>();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { successBanner, errorBanner } = useBannerDispatchContext();
  const [disablePatch] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      successBanner(`Tasks in this patch were disabled`);
    },
    onError: (err) => {
      errorBanner(`Unable to disable patch tasks: ${err.message}`);
    },
    refetchQueries: ["Patch"],
  });

  const hideMenu = () => setIsVisible(false);

  useEffect(() => {
    if (isActionLoading) {
      setIsVisible(false);
    }
  }, [isActionLoading, setIsVisible]);

  const dropdownItems = [
    <LinkToReconfigurePage
      key="reconfigure"
      patchId={patchId}
      disabled={isPatchOnCommitQueue}
    />,
    <UnschedulePatchTasks
      {...{
        patchId,
        hideMenu,
        refetchQueries: ["Patch"],
        key: "unschedule",
        setParentLoading: setIsActionLoading,
        disabled: isActionLoading,
      }}
    />,
    <DropdownItem
      key="disable-button"
      data-cy="disable"
      disabled={false}
      onClick={() => {
        disablePatch({
          variables: { patchId, priority: -1 },
        });
      }}
    >
      <Disclaimer>Disable all tasks</Disclaimer>
    </DropdownItem>,
    <SetPatchPriority
      {...{
        patchId,
        hideMenu,
        key: "priority",
        disabled: isActionLoading,
        refetchQueries: ["Patch"],
        setParentLoading: setIsActionLoading,
      }}
    />,
    <EnqueuePatch
      {...{
        patchId,
        hideMenu,
        key: "enqueue",
        disabled: isActionLoading || !canEnqueueToCommitQueue,
        refetchQueries: ["Patch"],
        setParentLoading: setIsActionLoading,
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
            disabled: isActionLoading,
            setParentLoading: setIsActionLoading,
            refetchQueries: ["Patch"],
          }}
        />
        <RestartPatch
          {...{
            patchId,
            hideMenu,
            isButton: true,
            disabled: isActionLoading,
            refetchQueries: ["Patch"],
          }}
        />
        <AddNotification
          {...{
            patchId,
            hideMenu,
            refetchQueries: ["Patch"],
            key: "notification",
            setParentLoading: setIsActionLoading,
            disabled: isActionLoading,
          }}
        />
        <ButtonDropdown
          disabled={isActionLoading}
          dropdownItems={dropdownItems}
          isVisibleDropdown={isVisible}
          setIsVisibleDropdown={setIsVisible}
          loading={false}
        />
      </PageButtonRow>
    </>
  );
};
