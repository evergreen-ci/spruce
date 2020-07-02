import React, { forwardRef } from "react";
import { Popconfirm } from "antd";
import { DropdownItem } from "components/ButtonDropdown";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useBannerDispatchContext } from "context/banners";
import {
  EnqueuePatchMutation,
  EnqueuePatchMutationVariables,
} from "gql/generated/types";
import { ENQUEUE_PATCH } from "gql/mutations";
import { usePatchAnalytics } from "analytics";
import { useMutation } from "@apollo/react-hooks";
import { StyledBody } from "./UnschedulePatchTasks";

interface EnqueueProps {
  patchId: string;
  disabled: boolean;
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  refetchQueries: string[];
  setParentLoading?: (loading: boolean) => void; // used to toggle loading state of parent
}
export const EnqueuePatch = forwardRef<HTMLDivElement, EnqueueProps>(
  (
    {
      patchId,
      disabled,
      hideMenu,
      refetchQueries,
      setParentLoading = () => undefined,
    },
    ref
  ) => {
    const { successBanner, errorBanner } = useBannerDispatchContext();

    const [enqueuePatch, { loading: loadingEnqueuePatch }] = useMutation<
      EnqueuePatchMutation,
      EnqueuePatchMutationVariables
    >(ENQUEUE_PATCH, {
      onCompleted: () => {
        successBanner(`Enqueued patch`);
        setParentLoading(false);
        hideMenu();
      },
      onError: (err) => {
        errorBanner(`Error enqueueing patch: ${err.message}`);
        setParentLoading(false);
      },
      refetchQueries,
    });

    const patchAnalytics = usePatchAnalytics();

    return (
      <Popconfirm
        key="enqueue"
        icon={null}
        placement="left"
        title={<StyledBody>Enqueue patch on the commit queue?</StyledBody>}
        onConfirm={() => {
          setParentLoading(true);
          enqueuePatch({ variables: { patchId } });
          patchAnalytics.sendEvent({ name: "Enqueue" });
        }}
        onCancel={hideMenu}
        okText="Yes"
        cancelText="Cancel"
      >
        <DropdownItem
          data-cy="enqueue-patch"
          disabled={disabled || loadingEnqueuePatch}
          ref={ref}
        >
          <Disclaimer>Enqueue patch</Disclaimer>
        </DropdownItem>
      </Popconfirm>
    );
  }
);
