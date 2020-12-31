import React, { useState } from "react";
import { Disclaimer } from "@leafygreen-ui/typography";
import { DropdownItem } from "components/ButtonDropdown";
import { EnqueuePatchModal } from "pages/patch/index";

interface EnqueuePatchProps {
  patchId: string;
  commitMessage: string;
  disabled: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  hideMenu: (e?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  setParentLoading?: (loading: boolean) => void;
}
export const EnqueuePatch: React.FC<EnqueuePatchProps> = ({
  patchId,
  commitMessage,
  disabled,
  refetchQueries,
  hideMenu,
  visibilityControl,
  setParentLoading = () => undefined,
}) => {
  const fallbackVisibilityControl = useState(false);
  const [isVisible, setIsVisible] =
    visibilityControl !== undefined
      ? visibilityControl
      : fallbackVisibilityControl;

  const onClick = () => setIsVisible(!isVisible);
  const onFinished = () => {
    setIsVisible(false);
    hideMenu();
  };
  return (
    <>
      <DropdownItem
        disabled={disabled}
        data-cy="enqueue-patch"
        onClick={onClick}
      >
        <Disclaimer>Add to commit queue</Disclaimer>
      </DropdownItem>
      <EnqueuePatchModal
        patchId={patchId}
        commitMessage={commitMessage}
        visible={isVisible}
        onFinished={onFinished}
        refetchQueries={refetchQueries}
        setParentLoading={setParentLoading}
      />
    </>
  );
};
