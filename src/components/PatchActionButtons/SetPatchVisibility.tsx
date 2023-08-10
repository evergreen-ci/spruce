import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import { usePatchAnalytics } from "analytics";
import Popconfirm from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  SetPatchVisibilityMutation,
  SetPatchVisibilityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_VISIBILITY } from "gql/mutations";

interface Props {
  patchId: string;
  refetchQueries?: string[];
}
export const SetPatchVisibility: React.FC<Props> = ({
  patchId,
  refetchQueries = [],
}) => {
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);
  const { sendEvent } = usePatchAnalytics(patchId);
  const [setPatchVisibility] = useMutation<
    SetPatchVisibilityMutation,
    SetPatchVisibilityMutationVariables
  >(SET_PATCH_VISIBILITY, {
    onCompleted: () => {
      dispatchToast.success("This patch was successfully hidden");
    },
    onError: (err) => {
      dispatchToast.error(`Unable to hide this patch: ${err.message}`);
    },
    refetchQueries,
  });

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem active={open} onClick={() => setOpen(!open)}>
          Hide patch
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        onConfirm={() => {
          sendEvent({ name: "Set Patch Visibility", hidden: true });
          setPatchVisibility({
            variables: { patchIds: [patchId], hidden: true },
          });
        }}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <Body weight="medium">Hide patch?</Body>
        <Body>
          Hiding this patch will prevent it from being displayed in the patches
          pages. This cannot be undone!
        </Body>
      </Popconfirm>
    </>
  );
};
