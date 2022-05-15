import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { useAnnotationAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { ConfirmationModal } from "components/ConfirmationModal";
import { HR } from "components/styles/Layout";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
  IssueLinkInput,
} from "gql/generated/types";
import { ADD_ANNOTATION } from "gql/mutations";
import { numbers } from "utils";
import { useAddIssueModal } from "./state";

const { toDecimal } = numbers;
interface Props {
  visible: boolean;
  dataCy: string;
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

  const [state, dispatch] = useAddIssueModal();

  const [addAnnotation] = useMutation<
    AddAnnotationIssueMutation,
    AddAnnotationIssueMutationVariables
  >(ADD_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully added ${issueString}`);
      dispatch.reset();
      setSelectedRowKey(state.issueKey);
      closeModal();
      annotationAnalytics.sendEvent({ name: analyticsType });
    },
    onError(error) {
      dispatchToast.error(
        `There was an error adding the issue: ${error.message}`
      );
    },
    refetchQueries: ["GetAnnotationEventData"],
  });

  const handleSubmit = () => {
    const apiIssue: IssueLinkInput = {
      url: state.url,
      issueKey: state.issueKey,
      confidenceScore: toDecimal(state.confidenceScore),
    };
    addAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
  };

  const handleCancel = () => {
    dispatch.reset();
    closeModal();
  };

  return (
    <ConfirmationModal
      data-cy={dataCy}
      open={visible}
      onCancel={handleCancel}
      title={title}
      onConfirm={handleSubmit}
      submitDisabled={!state.canSubmit}
      buttonText={`Add ${issueString}`}
    >
      <StyledTextInput
        data-cy="url-text-area"
        label="URL"
        value={state.url}
        onChange={(e) => dispatch.setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        state={state.isURLValid ? "none" : "error"}
        errorMessage="Please enter a valid URL"
      />
      <StyledTextInput
        data-cy="issue-key-text-area"
        label="Display Text"
        value={state.issueKey}
        onChange={(e) => dispatch.setKey(e.target.value)}
        required
        state={state.isKeyValid ? "none" : "error"}
        errorMessage="Display Text must contain at least one character"
      />
      <HR />
      <Accordion title="Advanced Options">
        <TextInput
          data-cy="confidence-level"
          label="Confidence Level"
          description="The confidence level of the issue. This is a number between 0 and 100 representing a percentage."
          value={state.confidenceScore}
          optional
          onChange={(e) => dispatch.setConfidenceScore(e.target.value)}
        />
      </Accordion>
    </ConfirmationModal>
  );
};

const StyledTextInput = styled(TextInput)`
  margin-bottom: ${size.s};
`;
