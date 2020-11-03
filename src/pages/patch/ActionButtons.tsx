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
  const refetchQueries = ["Patch"];
  const [setPatchPriority] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      successBanner(`Priority for all tasks was updated`);
    },
    onError: (err) => {
      errorBanner(`Error setting priority: ${err.message}`);
    },
    refetchQueries,
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
        refetchQueries,
        key: "unschedule",
        setParentLoading: setIsActionLoading,
        disabled: isActionLoading,
      }}
    />,
    <DropdownItem
      data-cy="disable"
      disabled={false}
      onClick={() => {
        setPatchPriority({
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
        refetchQueries,
        setParentLoading: setIsActionLoading,
      }}
    />,
    <EnqueuePatch
      {...{
        patchId,
        hideMenu,
        key: "enqueue",
        disabled: isActionLoading || !canEnqueueToCommitQueue,
        refetchQueries,
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
            refetchQueries,
          }}
        />
        <RestartPatch
          {...{
            patchId,
            hideMenu,
            isButton: true,
            disabled: isActionLoading,
            refetchQueries,
          }}
        />
        <AddNotification
          {...{
            patchId,
            hideMenu,
            refetchQueries,
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
