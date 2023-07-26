import Button from "@leafygreen-ui/button";
import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroSettingsSection } from "gql/generated/types";
import { useDistroSettingsContext } from "./Context";
import { WritableDistroSettingsType } from "./tabs/types";

interface Props {
  tab: WritableDistroSettingsType;
}

export const HeaderButtons: React.VFC<Props> = ({ tab }) => {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapRouteToSection: Record<
  WritableDistroSettingsType,
  DistroSettingsSection
> = {
  [DistroSettingsTabRoutes.General]: DistroSettingsSection.General,
  [DistroSettingsTabRoutes.Host]: DistroSettingsSection.Host,
  [DistroSettingsTabRoutes.Project]: DistroSettingsSection.Project,
  [DistroSettingsTabRoutes.Provider]: DistroSettingsSection.Provider,
  [DistroSettingsTabRoutes.Task]: DistroSettingsSection.Task,
};
