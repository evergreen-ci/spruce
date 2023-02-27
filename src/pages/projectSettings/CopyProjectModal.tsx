import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useProjectSettingsAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { getProjectSettingsRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  CopyProjectMutation,
  CopyProjectMutationVariables,
} from "gql/generated/types";
import { COPY_PROJECT } from "gql/mutations";
import { projectId, projectName, requestS3Creds } from "./sharedFormSchema";

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
  const navigate = useNavigate();
  const dispatchToast = useToastContext();
  const { sendEvent } = useProjectSettingsAnalytics();

  const [formState, setFormState] = useState({
    projectId: "",
    projectName: "",
    requestS3Creds: false,
  });
  const [hasError, setHasError] = useState(true);

  const [copyProject, { called, data, error, loading }] = useMutation<
    CopyProjectMutation,
    CopyProjectMutationVariables
  >(COPY_PROJECT, { errorPolicy: "all" });

  useEffect(() => {
    // onCompleted and onError don't provide sufficient information when used with errorPolicy: 'all', so use hook to manage behavior after confirming modal.
    // https://github.com/apollographql/apollo-client/issues/6966
    if (!called || loading) {
      return;
    }

    const identifier = data?.copyProject?.identifier;
    if (identifier) {
      if (error) {
        dispatchToast.warning(
          `The project was successfully duplicated with the following errors: ${error.message}.`,
          true,
          { shouldTimeout: false }
        );
      } else {
        dispatchToast.success(
          `Successfully duplicated the project: ${identifier}`
        );
      }
      navigate(getProjectSettingsRoute(identifier), { replace: true });
    } else if (error) {
      dispatchToast.error(
        `There was an error duplicating the project: ${error?.message}`
      );
    }
  }, [
    called,
    data?.copyProject?.identifier,
    error,
    loading,
    navigate,
    dispatchToast,
  ]);

  const onConfirm = () => {
    copyProject({
      variables: {
        project: {
          ...(formState?.projectId && {
            newProjectId: formState.projectId,
          }),
          newProjectIdentifier: formState.projectName,
          projectIdToCopy: id,
        },
        requestS3Creds: formState.requestS3Creds,
      },
    });
    sendEvent({ name: "Duplicate project", projectIdToCopy: id });
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
      requestS3Creds: requestS3Creds.schema,
    },
  },
  uiSchema: {
    projectName: projectName.uiSchema,
    projectId: projectId.uiSchema,
    requestS3Creds: requestS3Creds.uiSchema,
  },
};
