import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { useToastContext } from "context/toast";
import {
  DistroOnSaveOperation,
  SaveDistroMutation,
  SaveDistroMutationVariables,
  DistroQuery,
} from "gql/generated/types";
import { SAVE_DISTRO } from "gql/mutations";
import { useDistroSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";
import { WritableDistroSettingsType } from "./tabs/types";

interface Props {
  tab: WritableDistroSettingsType;
  distro: DistroQuery["distro"];
}

export const HeaderButtons: React.VFC<Props> = ({ distro, tab }) => {
  const { getTab, saveTab } = useDistroSettingsContext();
  const { formData, hasChanges, hasError } = getTab(tab);
  const dispatchToast = useToastContext();

  const [saveDistroSection] = useMutation<
    SaveDistroMutation,
    SaveDistroMutationVariables
  >(SAVE_DISTRO, {
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
    // Only perform the save operation is the tab is valid.
    // eslint-disable-next-line no-prototype-builtins
    if (formToGqlMap.hasOwnProperty(tab)) {
      const formToGql = formToGqlMap[tab];
      const changes = formToGql(formData, distro);
      saveDistroSection({
        variables: {
          distro: changes,
          onSave: DistroOnSaveOperation.None,
        },
      });
    }
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
