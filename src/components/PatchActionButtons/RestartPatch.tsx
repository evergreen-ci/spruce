import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { DropdownItem } from "components/ButtonDropdown";
import { VersionRestartModal } from "components/VersionRestartModal";

interface RestartPatchProps {
  patchId: string;
  disabled?: boolean;
  isButton?: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
export const RestartPatch: React.FC<RestartPatchProps> = ({
  disabled = false,
  isButton,
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
          data-cy="restart-version"
          disabled={disabled}
          onClick={onClick}
        >
          Restart
        </Button>
      ) : (
        <DropdownItem
          disabled={disabled}
          data-cy="restart-version"
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
      />
    </>
  );
};
