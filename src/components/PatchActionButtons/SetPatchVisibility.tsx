import { useMutation } from "@apollo/client";
import { MenuItem } from "@leafygreen-ui/menu";
import { usePatchAnalytics } from "analytics";
import { useToastContext } from "context/toast";
import {
  SetPatchVisibilityMutation,
  SetPatchVisibilityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_VISIBILITY } from "gql/mutations";

interface Props {
  isPatchHidden: boolean;
  patchId: string;
  refetchQueries?: string[];
}
export const SetPatchVisibility: React.FC<Props> = ({
  isPatchHidden,
  patchId,
  refetchQueries = [],
}) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = usePatchAnalytics(patchId);
  const [setPatchVisibility] = useMutation<
    SetPatchVisibilityMutation,
    SetPatchVisibilityMutationVariables
  >(SET_PATCH_VISIBILITY, {
    onCompleted: (d) => {
      const copy = d.setPatchVisibility?.[0].hidden ? "hidden" : "unhidden";
      dispatchToast.success(`This patch was successfully ${copy}.`);
    },
    onError: (err) => {
      dispatchToast.error(`Unable to update patch visibility: ${err.message}`);
    },
    refetchQueries,
  });

  return (
    <MenuItem
      onClick={() => {
        sendEvent({ name: "Set Patch Visibility", hidden: !isPatchHidden });
        setPatchVisibility({
          variables: { patchIds: [patchId], hidden: !isPatchHidden },
        });
      }}
    >
      {isPatchHidden ? "Unhide" : "Hide"} patch
    </MenuItem>
  );
};
