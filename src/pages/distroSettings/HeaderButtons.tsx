import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { useParams } from "react-router-dom";
import { DistroSettingsTabRoutes } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  DistroOnSaveOperation,
  DistroSettingsSection,
  SaveDistroSectionMutation,
  SaveDistroSectionMutationVariables,
} from "gql/generated/types";
import { SAVE_DISTRO_SECTION } from "gql/mutations";
import { useDistroSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";
import { WritableDistroSettingsType, FormToGqlFunction } from "./tabs/types";

interface Props {
  tab: WritableDistroSettingsType;
}

export const HeaderButtons: React.VFC<Props> = ({ tab }) => {
  const { getTab, saveTab } = useDistroSettingsContext();
  const { formData, hasChanges, hasError } = getTab(tab);
  const dispatchToast = useToastContext();
  const { distroId } = useParams<{
    distroId: string;
  }>();

  const [saveDistroSection] = useMutation<
    SaveDistroSectionMutation,
    SaveDistroSectionMutationVariables
  >(SAVE_DISTRO_SECTION, {
    onCompleted: () => {
      saveTab(tab);
      dispatchToast.success("Successfully updated distro.");
    },
    onError: (err) => {
      dispatchToast.error(
        `There was an error updating the distro: ${err.message}`
      );
    },
    refetchQueries: ["Distro"],
  });

  // TODO: Add save modal in EVG-20565. Allow the user to specify the on save operation.
  // Disable the button if the user does not have editing permissions.
  const onClick = () => {
    const formToGql: FormToGqlFunction<WritableDistroSettingsType> =
      formToGqlMap[tab];
    const changes = formToGql(formData);
    saveDistroSection({
      variables: {
        distroId,
        changes,
        onSave: DistroOnSaveOperation.None,
        section: tab.toUpperCase() as DistroSettingsSection,
      },
    });
  };

  return (
    <Button
      data-cy="save-settings-button"
      variant="primary"
      onClick={onClick}
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
