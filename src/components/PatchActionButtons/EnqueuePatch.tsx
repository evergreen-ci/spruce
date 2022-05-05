import { useState } from "react";
import { useQuery } from "@apollo/client";
import { DropdownItem } from "components/ButtonDropdown";
import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
} from "gql/generated/types";
import { GET_CODE_CHANGES } from "gql/queries";
import { EnqueuePatchModal } from "pages/version/index";
import { commits } from "utils";

const { shouldPreserveCommits } = commits;

interface EnqueuePatchProps {
  patchId: string;
  commitMessage: string;
  disabled: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const EnqueuePatch: React.VFC<EnqueuePatchProps> = ({
  patchId,
  commitMessage,
  disabled,
  refetchQueries,
  visibilityControl,
}) => {
  const fallbackVisibilityControl = useState(false);
  const [isVisible, setIsVisible] =
    visibilityControl !== undefined
      ? visibilityControl
      : fallbackVisibilityControl;

  const { data, previousData } = useQuery<
    CodeChangesQuery,
    CodeChangesQueryVariables
  >(GET_CODE_CHANGES, {
    variables: { id: patchId },
    skip: !isVisible,
  });
  const { patch } = data ?? previousData ?? {};
  const { moduleCodeChanges } = patch ?? {};
  const preserveCommits = moduleCodeChanges?.length
    ? shouldPreserveCommits(moduleCodeChanges[0].fileDiffs)
    : false;

  return (
    <>
      <DropdownItem
        data-cy="enqueue-patch"
        disabled={disabled}
        onClick={() => setIsVisible(!isVisible)}
      >
        Add to commit queue
      </DropdownItem>
      <EnqueuePatchModal
        patchId={patchId}
        commitMessage={commitMessage}
        visible={isVisible}
        onFinished={() => setIsVisible(false)}
        refetchQueries={refetchQueries}
        preserveCommits={preserveCommits}
      />
    </>
  );
};
