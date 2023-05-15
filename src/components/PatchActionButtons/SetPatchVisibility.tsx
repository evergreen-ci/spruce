import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
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
export const SetPatchVisibility: React.VFC<Props> = ({
  patchId,
  refetchQueries = [],
}) => {
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [setPatchVisibility] = useMutation<
    SetPatchVisibilityMutation,
    SetPatchVisibilityMutationVariables
  >(SET_PATCH_VISIBILITY, {
    onCompleted: () => {
      dispatchToast.success(`This patch was successfully hidden`);
    },
    onError: (err) => {
      dispatchToast.error(`Unable to hide this patch: ${err.message}`);
    },
    refetchQueries,
  });

  return (
    <>
      <div ref={menuItemRef}>
        <MenuItem
          active={open}
          data-cy="disable"
          onClick={() => setOpen(!open)}
        >
          Hide Patch
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        onConfirm={() => {
          setPatchVisibility({
            variables: { patchIds: [patchId], hidden: true },
          });
        }}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <Body weight="medium">Hide Patch?</Body>
        <Body>
          Hiding this patch will prevent it from being displayed in the my
          patches page. This can not be undone!
        </Body>
      </Popconfirm>
    </>
  );
};
