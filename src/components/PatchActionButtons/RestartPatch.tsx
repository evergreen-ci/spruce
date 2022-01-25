import React, { useState } from "react";
import { Button } from "components/Button";
import { DropdownItem } from "components/ButtonDropdown";
import { VersionRestartModal } from "components/VersionRestartModal";
import { Patch } from "gql/generated/types";

interface RestartPatchProps {
  patchId: string;
  disabled?: boolean;
  isButton?: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  childPatches: Partial<Patch>[];
  isPatch?: boolean;
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  isButton,
  disabled = false,
  patchId,
  refetchQueries,
  visibilityControl,
  childPatches,
  isPatch = true,
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
          disabled={disabled}
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
          Restart
        </DropdownItem>
      )}
      <VersionRestartModal
        versionId={patchId}
        visible={isVisible}
        onOk={() => {
          setIsVisible(false);
        }}
        onCancel={() => setIsVisible(false)}
        refetchQueries={refetchQueries}
        childPatches={childPatches}
        isPatch={isPatch}
      />
    </>
  );
};
