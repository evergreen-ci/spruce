import { useState } from "react";
import { DropdownItem } from "components/ButtonDropdown";
import { EnqueuePatchModal } from "pages/version/index";

interface EnqueuePatchProps {
  patchId: string;
  commitMessage: string;
  disabled: boolean;
  refetchQueries?: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const EnqueuePatch: React.FC<EnqueuePatchProps> = ({
  commitMessage,
  disabled,
  patchId,
  refetchQueries = [],
  visibilityControl,
}) => {
  const fallbackVisibilityControl = useState(false);
  const [isVisible, setIsVisible] =
    visibilityControl !== undefined
      ? visibilityControl
      : fallbackVisibilityControl;

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
      />
    </>
  );
};
