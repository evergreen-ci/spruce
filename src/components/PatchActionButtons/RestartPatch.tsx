import React, { useState } from "react";
import { Disclaimer } from "@leafygreen-ui/typography";
import { Button } from "components/Button";
import { DropdownItem } from "components/ButtonDropdown";
import { PatchRestartModal } from "pages/patch/index";

interface RestartPatchProps {
  patchId: string;
  disabled?: boolean;
  isButton?: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  isButton,
  disabled,
  patchId,
  refetchQueries,
  visibilityControl,
}) => {
  const fallbackVisibilityControl = useState(false);
  const [isVisible, setIsVisible] =
    visibilityControl !== undefined
      ? visibilityControl
      : fallbackVisibilityControl;

  const onClick = () => setIsVisible(!isVisible);

  return (
    <>
      {isButton ? (
        <Button
          size="small"
          data-cy="restart-patch"
          disabled={false}
          loading={false}
          onClick={onClick}
        >
          Restart
        </Button>
      ) : (
        <DropdownItem
          disabled={disabled}
          data-cy="restart-patch"
          onClick={onClick}
        >
          <Disclaimer>Restart</Disclaimer>
        </DropdownItem>
      )}
      <PatchRestartModal
        patchId={patchId}
        visible={isVisible}
        onOk={() => {
          setIsVisible(false);
        }}
        onCancel={() => setIsVisible(false)}
        refetchQueries={refetchQueries}
      />
    </>
  );
};
