import { useMutation } from "@apollo/client";
import { DropdownItem } from "components/ButtonDropdown";
import { useToastContext } from "context/toast";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY } from "gql/mutations";

interface Props {
  patchId: string;
  refetchQueries: string[];
}
export const DisableTasks: React.VFC<Props> = ({ patchId, refetchQueries }) => {
  const dispatchToast = useToastContext();
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
    <DropdownItem
      data-cy="disable"
      disabled={false}
      onClick={() => {
        disablePatch({
          variables: { patchId, priority: -1 },
        });
      }}
    >
      Disable all tasks
    </DropdownItem>
  );
};
