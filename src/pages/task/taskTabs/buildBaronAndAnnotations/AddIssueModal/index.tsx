import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useAnnotationAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SpruceForm } from "components/SpruceForm";
import { AccordionFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { SpruceFormProps } from "components/SpruceForm/types";
import { useToastContext } from "context/toast";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
  IssueLinkInput,
} from "gql/generated/types";
import { ADD_ANNOTATION } from "gql/mutations";
import { useSpruceConfig } from "hooks";
import { numbers, string } from "utils";

const { toDecimal } = numbers;
const { getTicketFromJiraURL } = string;

interface Props {
  visible: boolean;
  closeModal: () => void;
  setSelectedRowKey: (key: string) => void;
  taskId: string;
  execution: number;
  isIssue: boolean;
}

export const AddIssueModal: React.FC<Props> = ({
  closeModal,
  execution,
  isIssue,
  setSelectedRowKey,
  taskId,
  visible,
  ...rest
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const title = isIssue ? "Add Issue" : "Add Suspected Issue";
  const issueString = isIssue ? "issue" : "suspected issue";
  const analyticsType = isIssue
    ? "Add Task Annotation Issue"
    : "Add Task Annotation Suspected Issue";

  const [canSubmit, setCanSubmit] = useState(false);
  const [formState, setFormState] = useState({
    url: "",
    advancedOptions: {
      confidenceScore: null,
    },
  });
  const issueKey = getTicketFromJiraURL(formState.url);

  const [addAnnotation] = useMutation<
    AddAnnotationIssueMutation,
    AddAnnotationIssueMutationVariables
  >(ADD_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully added ${issueString}`);
      setSelectedRowKey(issueKey);
      closeModal();
      annotationAnalytics.sendEvent({ name: analyticsType });
    },
    onError(error) {
      closeModal();
      dispatchToast.error(
        `There was an error adding the issue: ${error.message}`,
      );
    },
    refetchQueries: ["AnnotationEventData"],
  });

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const handleSubmit = () => {
    const apiIssue: IssueLinkInput = {
      url: formState.url,
      issueKey,
      confidenceScore: toDecimal(formState.advancedOptions.confidenceScore),
    };
    addAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <ConfirmationModal
      {...rest}
      open={visible}
      onCancel={handleCancel}
      title={title}
      onConfirm={handleSubmit}
      buttonText={`Add ${issueString}`}
      submitDisabled={!canSubmit}
      data-cy="add-issue-modal"
    >
      {jiraHost && (
        <SpruceForm
          onSubmit={handleSubmit}
          schema={addIssueModalSchema.schema}
          uiSchema={addIssueModalSchema.uiSchema}
          formData={formState}
          onChange={({ errors, formData }) => {
            setFormState(formData);
            setCanSubmit(errors.length === 0);
          }}
          customFormatFields={{
            jiraHost,
          }}
        />
      )}
    </ConfirmationModal>
  );
};

const addIssueModalSchema: SpruceFormProps = {
  schema: {
    type: "object" as "object",
    properties: {
      url: {
        type: "string" as "string",
        title: "Ticket URL",
        minLength: 1,
        format: "validJiraURL",
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
    required: ["url"],
  },
  uiSchema: {
    url: {
      "ui:data-cy": "issue-url",
    },
    advancedOptions: {
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:displayTitle": "Advanced Options",
      confidenceScore: {
        "ui:data-cy": "confidence-level",
        "ui:description":
          "The confidence score of the issue. This is a number between 0 and 100 representing a percentage.",
        "ui:optional": true,
      },
    },
  },
};
