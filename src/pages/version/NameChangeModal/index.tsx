import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { ConfirmationModal } from "components/ConfirmationModal";
import Icon from "components/Icon";
import { SpruceForm } from "components/SpruceForm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UpdatePatchDescriptionMutation,
  UpdatePatchDescriptionMutationVariables,
} from "gql/generated/types";
import { UPDATE_PATCH_DESCRIPTION } from "gql/mutations";
import { getFormSchema } from "./getFormSchema";

interface NameChangeModalProps {
  originalPatchName: string;
  patchId: string;
}
export const NameChangeModal: React.VFC<NameChangeModalProps> = ({
  originalPatchName,
  patchId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [formState, setFormState] = useState<{ newPatchName?: string }>({});
  const { schema, uiSchema } = getFormSchema(originalPatchName);
  const dispatchToast = useToastContext();
  const [updateDescription, { loading }] = useMutation<
    UpdatePatchDescriptionMutation,
    UpdatePatchDescriptionMutationVariables
  >(UPDATE_PATCH_DESCRIPTION, {
    onCompleted() {
      setIsOpen(false);
      dispatchToast.success("Patch name has successfully updated.");
    },
    onError({ message }) {
      dispatchToast.error(`Error updating patch name: ${message}.`);
    },
    refetchQueries: ["Version"],
  });

  const { newPatchName } = formState;
  useEffect(() => {
    setIsDisabled(
      !newPatchName || newPatchName === originalPatchName || loading
    );
  }, [newPatchName, loading, originalPatchName]);

  return (
    <>
      <StyledIconButton
        onClick={() => setIsOpen(true)}
        aria-label="name-change-modal-trigger"
      >
        <Icon glyph="Edit" />
      </StyledIconButton>
      <ConfirmationModal
        buttonText="Confirm"
        onCancel={() => setIsOpen(false)}
        onConfirm={() => {
          updateDescription({
            variables: { patchId, description: formState.newPatchName },
          });
        }}
        open={isOpen}
        title="Update Patch Name"
        submitDisabled={isDisabled}
      >
        <SpruceForm
          schema={schema}
          uiSchema={uiSchema}
          formData={formState}
          onChange={({ formData }) => {
            setFormState(formData);
          }}
        />
      </ConfirmationModal>
    </>
  );
};

const StyledIconButton = styled(IconButton)`
  vertical-align: top;
  margin-left: ${size.xxs};
`;
