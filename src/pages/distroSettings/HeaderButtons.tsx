import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Radio, RadioGroup } from "@leafygreen-ui/radio-group";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import pluralize from "pluralize";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  DistroOnSaveOperation,
  DistroQuery,
  SaveDistroMutation,
  SaveDistroMutationVariables,
} from "gql/generated/types";
import { SAVE_DISTRO } from "gql/mutations";
import { useDistroSettingsContext } from "./Context";
import { formToGqlMap } from "./tabs/transformers";
import { WritableDistroSettingsType } from "./tabs/types";

interface Props {
  distro: DistroQuery["distro"];
  tab: WritableDistroSettingsType;
}

export const HeaderButtons: React.FC<Props> = ({ distro, tab }) => {
  const dispatchToast = useToastContext();

  const { getTab, saveTab } = useDistroSettingsContext();
  const { formData, hasChanges, hasError } = getTab(tab);

  const [modalOpen, setModalOpen] = useState(false);
  const [onSaveOperation, setOnSaveOperation] = useState(
    DistroOnSaveOperation.None
  );

  const [saveDistro] = useMutation<
    SaveDistroMutation,
    SaveDistroMutationVariables
  >(SAVE_DISTRO, {
    onCompleted({ saveDistro: { hostCount } }) {
      saveTab(tab);
      dispatchToast.success(
        `Updated distro${
          hostCount
            ? ` and scheduled ${hostCount} ${pluralize(
                "host",
                hostCount
              )} to update`
            : ""
        }.`
      );
    },
    onError(err) {
      dispatchToast.error(err.message);
    },
    refetchQueries: ["Distro"],
  });

  const handleSave = () => {
    // Only perform the save operation is the tab is valid.
    // eslint-disable-next-line no-prototype-builtins
    if (formToGqlMap.hasOwnProperty(tab)) {
      const formToGql = formToGqlMap[tab];
      const changes = formToGql(formData, distro);
      saveDistro({
        variables: {
          distro: changes,
          onSave: DistroOnSaveOperation.None,
        },
      });
      setModalOpen(false);
    }
  };

  return (
    <>
      <Button
        data-cy="save-settings-button"
        disabled={hasError || !hasChanges}
        onClick={() => setModalOpen(true)}
        variant="primary"
      >
        Save changes on page
      </Button>
      <ConfirmationModal
        buttonText="Save"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleSave}
        title="Save page"
      >
        <StyledBody>
          Evergreen can perform one of the following actions on save:
        </StyledBody>
        <RadioGroup
          onChange={(e) =>
            setOnSaveOperation(e.target.value as DistroOnSaveOperation)
          }
          value={onSaveOperation}
        >
          <Radio value={DistroOnSaveOperation.None}>
            Nothing, only new hosts will have updated distro settings applied
          </Radio>
          <Radio value={DistroOnSaveOperation.Decommission}>
            Decommission hosts of this distro
          </Radio>
          <Radio value={DistroOnSaveOperation.RestartJasper}>
            Restart Jasper service on running hosts of this distro
          </Radio>
          <Radio value={DistroOnSaveOperation.Reprovision}>
            Reprovision running hosts of this distro
          </Radio>
        </RadioGroup>
      </ConfirmationModal>
    </>
  );
};

const StyledBody = styled(Body)<BodyProps>`
  margin-bottom: ${size.xs};
`;
