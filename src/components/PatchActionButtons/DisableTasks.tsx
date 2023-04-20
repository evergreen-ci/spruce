import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { MenuItem } from "@leafygreen-ui/menu";
import { Body } from "@leafygreen-ui/typography";
import Popconfirm from "components/Popconfirm";
import { size } from "constants/tokens";
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
export const DisableTasks: React.VFC<Props> = ({
  patchId,
  refetchQueries = [],
}) => {
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
    <Popconfirm
      align="left"
      onConfirm={() => {
        disablePatch({
          variables: { patchId, priority: -1 },
        });
      }}
      trigger={
        <div>
          <MenuItem data-cy="disable" disabled={false}>
            Disable all tasks
          </MenuItem>
        </div>
      }
    >
      <StyledBody weight="medium">Disable all tasks?</StyledBody>
      <StyledBody>
        Disabling tasks prevents them from running unless explicitly activated
        by a user.
      </StyledBody>
    </Popconfirm>
  );
};

const StyledBody = styled(Body)`
  margin-bottom: ${size.xs};
`;
