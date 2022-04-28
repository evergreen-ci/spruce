import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import Tooltip from "@leafygreen-ui/tooltip";
import { useAnnotationAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { Modal } from "components/Modal";
import { useToastContext } from "context/toast";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
  IssueLinkInput,
} from "gql/generated/types";
import { ADD_ANNOTATION } from "gql/mutations";
import { useAddIssueModal } from "./state";
import { toDecimal } from "./utils";

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
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={handleCancel}
      title={title}
      footer={
        <>
          <Button data-cy="modal-cancel-button" onClick={handleCancel}>
            Cancel
          </Button>
          <Tooltip
            usePortal={false}
            trigger={
              <span>
                <Button
                  data-cy="add-issue-save-button"
                  variant="primary"
                  disabled={!state.canSubmit}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </span>
            }
            enabled={!state.canSubmit}
          >
            You must complete the form before you can save.
          </Tooltip>
        </>
      }
    >
      <TextInput
        data-cy="url-text-area"
        label="URL"
        value={state.url}
        onChange={(e) => dispatch.setUrl(e.target.value)}
      />
      <TextInput
        data-cy="issue-key-text-area"
        label="Display Text"
        value={state.issueKey}
        onChange={(e) => dispatch.setKey(e.target.value)}
      />
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
    </Modal>
  );
};
