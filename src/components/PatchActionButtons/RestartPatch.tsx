import { useState } from "react";
import { DropdownItem } from "components/ButtonDropdown";
import { LoadingButton } from "components/Buttons";
import { VersionRestartModal } from "components/VersionRestartModal";

interface RestartPatchProps {
  patchId: string;
  disabled?: boolean;
  isButton?: boolean;
  refetchQueries: string[];
  visibilityControl?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}
export const RestartPatch: React.VFC<RestartPatchProps> = ({
  isButton,
  disabled = false,
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
        <LoadingButton
          size="small"
          data-cy="restart-patch"
          disabled={disabled}
          loading={false}
          onClick={onClick}
        >
          Restart
        </LoadingButton>
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
      />
    </>
  );
};
