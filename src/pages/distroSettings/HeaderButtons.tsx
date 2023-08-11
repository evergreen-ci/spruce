import Button from "@leafygreen-ui/button";
import { useDistroSettingsContext } from "./Context";
import { WritableDistroSettingsType } from "./tabs/types";

interface Props {
  tab: WritableDistroSettingsType;
}

export const HeaderButtons: React.FC<Props> = ({ tab }) => {
  const { getTab } = useDistroSettingsContext();
  const { hasChanges, hasError } = getTab(tab);

  return (
    <Button
      data-cy="save-settings-button"
      variant="primary"
      onClick={() => {}}
      disabled={hasError || !hasChanges}
    >
      Save changes on page
    </Button>
  );
};
