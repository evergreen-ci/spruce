import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import Popconfirm from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";

interface Props {
  patchId: string;
  refetchQueries?: string[];
}
export const DisableTasks: React.FC<Props> = ({
  patchId,
  refetchQueries = [],
}) => {
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(false);
  const menuItemRef = useRef<HTMLDivElement>(null);

  const [disablePatch] = useMutation<
    SetPatchPriorityMutation,
    SetPatchPriorityMutationVariables
  >(SET_PATCH_PRIORITY, {
    onCompleted: () => {
      dispatchToast.success(`Tasks in this patch were disabled`);
    },
    onError: (err) => {
      dispatchToast.error(`Unable to disable patch tasks: ${err.message}`);
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
          Disable all tasks
        </MenuItem>
      </div>
      <Popconfirm
        align="left"
        onConfirm={() => {
          disablePatch({
            variables: { patchId, priority: -1 },
          });
        }}
        open={open}
        refEl={menuItemRef}
        setOpen={setOpen}
      >
        <Body weight="medium">Disable all tasks?</Body>
        <Body>
          Disabling tasks prevents them from running unless explicitly activated
          by a user.
        </Body>
      </Popconfirm>
    </>
  );
};
