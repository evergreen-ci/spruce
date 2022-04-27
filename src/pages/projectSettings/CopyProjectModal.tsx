import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { getProjectSettingsRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CopyProjectMutation,
  CopyProjectMutationVariables,
} from "gql/generated/types";
import { COPY_PROJECT } from "gql/mutations";
import { projectId, projectName } from "./sharedFormSchema";

interface Props {
  handleClose: () => void;
  id: string;
  label: string;
  open: boolean;
}

export const CopyProjectModal: React.VFC<Props> = ({
  handleClose,
  id,
  label,
  open,
}) => {
  const dispatchToast = useToastContext();
  const { replace } = useHistory();

  const [formState, setFormState] = useState({
    projectId: "",
    projectName: "",
  });
  const [hasError, setHasError] = useState(true);

  const [copyProject] = useMutation<
    CopyProjectMutation,
    CopyProjectMutationVariables
  >(COPY_PROJECT, {
    onCompleted({ copyProject: { identifier } }) {
      dispatchToast.success(`Successfully created the project: ${identifier}`);
      replace(getProjectSettingsRoute(identifier));
    },
    onError(err) {
      dispatchToast.error(
        `There was an error creating the project: ${err.message}`
      );
    },
    refetchQueries: ["ProjectSettings", "RepoSettings"],
  });

  const onConfirm = () => {
    copyProject({
      variables: {
        project: {
          newProjectId: formState.projectId,
          newProjectIdentifier: formState.projectName,
          projectIdToCopy: id,
        },
      },
    });
    handleClose();
  };

  return (
    <ConfirmationModal
      buttonText="Duplicate"
      data-cy="copy-project-modal"
      onCancel={handleClose}
      onConfirm={onConfirm}
      open={open}
      submitDisabled={hasError}
      title={`Duplicate “${label}”`}
    >
      <SpruceForm
        formData={formState}
        onChange={({ formData, errors }) => {
          setHasError(errors.length > 0);
          setFormState(formData);
        }}
        schema={modalFormDefinition.schema}
        uiSchema={modalFormDefinition.uiSchema}
      />
    </ConfirmationModal>
  );
};

const modalFormDefinition = {
  schema: {
    type: "object" as "object",
    properties: {
      projectName: projectName.schema,
      projectId: projectId.schema,
    },
  },
  uiSchema: {
    projectName: projectName.uiSchema,
    projectId: projectId.uiSchema,
  },
};
