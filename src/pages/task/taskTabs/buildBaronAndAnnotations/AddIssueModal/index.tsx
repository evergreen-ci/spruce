import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useAnnotationAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { useToastContext } from "context/toast";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
  IssueLinkInput,
} from "gql/generated/types";
import { ADD_ANNOTATION } from "gql/mutations";
import { numbers, validators } from "utils";

const { toDecimal } = numbers;
const { validateURL } = validators;
interface Props {
  visible: boolean;
  dataCy?: string;
  closeModal: () => void;
  setSelectedRowKey: (key: string) => void;
  taskId: string;
  execution: number;
  isIssue: boolean;
}

export const AddIssueModal: React.VFC<Props> = ({
  visible,
  dataCy,
  closeModal,
  setSelectedRowKey,
  taskId,
  execution,
  isIssue,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const title = isIssue ? "Add Issue" : "Add Suspected Issue";
  const issueString = isIssue ? "issue" : "suspected issue";
  const analyticsType = isIssue
    ? "Add Task Annotation Issue"
    : "Add Task Annotation Suspected Issue";

  const [formState, setFormState] = useState({
    url: "",
    issueKey: "",
    advancedOptions: {
      confidenceScore: null,
    },
  });
  const [canSubmit, setCanSubmit] = useState(false);

  const [addAnnotation] = useMutation<
    AddAnnotationIssueMutation,
    AddAnnotationIssueMutationVariables
  >(ADD_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully added ${issueString}`);
      setSelectedRowKey(formState.issueKey);
      closeModal();
      annotationAnalytics.sendEvent({ name: analyticsType });
    },
    onError(error) {
      closeModal();
      dispatchToast.error(
        `There was an error adding the issue: ${error.message}`
      );
    },
    refetchQueries: ["GetAnnotationEventData"],
  });

  const handleSubmit = () => {
    const apiIssue: IssueLinkInput = {
      url: formState.url,
      issueKey: formState.issueKey,
      confidenceScore: toDecimal(formState.advancedOptions.confidenceScore),
    };
    addAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleURLValidation = (formData, errors) => {
    if (!validateURL(formData.url)) {
      errors.url.addError("Please enter a valid URL");
    }
    if (formData.issueKey.length === 0) {
      errors.issueKey.addError("Please enter an issue key");
    }
    return errors;
  };

  return (
    <ConfirmationModal
      data-cy={dataCy}
      open={visible}
      onCancel={handleCancel}
      title={title}
      onConfirm={handleSubmit}
      buttonText={`Add ${issueString}`}
      submitDisabled={!canSubmit}
    >
      <SpruceForm
        onSubmit={handleSubmit}
        schema={addIssueModalSchema.schema}
        uiSchema={addIssueModalSchema.uiSchema}
        formData={formState}
        onChange={({ formData, errors }) => {
          setFormState(formData);
          setCanSubmit(!errors.length);
        }}
        validate={handleURLValidation}
      />
    </ConfirmationModal>
  );
};

const addIssueModalSchema: SpruceFormProps = {
  schema: {
    type: "object" as "object",
    properties: {
      url: {
        type: "string" as "string",
        title: "URL",
      },
      issueKey: {
        type: "string" as "string",
        title: "Display Text",
      },
      advancedOptions: {
        type: "object" as "object",
        properties: {
          confidenceScore: {
            type: ["number", "null"],
            title: "Confidence Score",
            minimum: 0,
            maximum: 100,
          },
        },
      },
    },
    required: ["url", "issueKey"],
  },
  uiSchema: {
    url: {
      "ui:data-cy": "url-text-area",
    },
    issueKey: {
      "ui:data-cy": "issue-key-text-area",
    },
    advancedOptions: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:displayTitle": "Advanced Options",
      confidenceScore: {
        "ui:data-cy": "confidence-level",
        "ui:description":
          "The confidence score of the issue. This is a number between 0 and 100 representing a percentage.",
      },
    },
  },
};
