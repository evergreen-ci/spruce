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

export const AddIssueModal: React.VFC<Props> = ({
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
    advancedOptions: {
      confidenceScore: null,
    },
    url: "",
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
        `There was an error adding the issue: ${error.message}`
      );
    },
    refetchQueries: ["AnnotationEventData"],
  });

  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;

  const handleSubmit = () => {
    const apiIssue: IssueLinkInput = {
      confidenceScore: toDecimal(formState.advancedOptions.confidenceScore),
      issueKey,
      url: formState.url,
    };
    addAnnotation({ variables: { apiIssue, execution, isIssue, taskId } });
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
    properties: {
      advancedOptions: {
        properties: {
          confidenceScore: {
            maximum: 100,
            minimum: 0,
            title: "Confidence Score",
            type: ["number", "null"],
          },
        },
        type: "object" as "object",
      },
      url: {
        format: "validJiraURL",
        minLength: 1,
        title: "Ticket URL",
        type: "string" as "string",
      },
    },
    required: ["url"],
    type: "object" as "object",
  },
  uiSchema: {
    advancedOptions: {
      confidenceScore: {
        "ui:data-cy": "confidence-level",
        "ui:description":
          "The confidence score of the issue. This is a number between 0 and 100 representing a percentage.",
        "ui:optional": true,
      },
      "ui:ObjectFieldTemplate": AccordionFieldTemplate,
      "ui:displayTitle": "Advanced Options",
    },
    url: {
      "ui:data-cy": "issue-url",
    },
  },
};
