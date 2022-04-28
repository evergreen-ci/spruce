import { useReducer } from "react";
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
import { useSpruceConfig } from "hooks";
import { validateJiraURL } from "utils/validators";

interface addIssueState {
  url: string;
  issueKey: string;
  canSubmit: boolean;
  isURLValid: boolean;
  isKeyValid: boolean;
  confidenceScore: string | null;
}

type Action =
  | { type: "reset" }
  | { type: "setUrl"; url: string; jiraURL: string }
  | { type: "setKey"; issueKey: string }
  | { type: "setConfidenceScore"; confidenceScore: string | null };

const init = () => ({
  url: "",
  issueKey: "",
  canSubmit: false,
  isURLValid: false,
  isKeyValid: false,
  confidenceScore: null,
});

const reducer = (state: addIssueState, action: Action) => {
  switch (action.type) {
    case "reset":
      return init();
    case "setUrl": {
      const isURLValid = validateJiraURL(action.jiraURL, action.url);
      return {
        ...state,
        url: action.url,
        canSubmit: isURLValid && state.isKeyValid,
        isURLValid,
      };
    }
    case "setKey": {
      const isKeyValid = action.issueKey.length > 0;
      return {
        ...state,
        issueKey: action.issueKey,
        isKeyValid,
        canSubmit: isKeyValid && state.isURLValid,
      };
    }
    case "setConfidenceScore": {
      const isNumber = !Number.isNaN(action.confidenceScore);
      if (isNumber) {
        if (
          toDecimal(action.confidenceScore) <= 1 &&
          toDecimal(action.confidenceScore) >= 0
        ) {
          return {
            ...state,
            confidenceScore: action.confidenceScore,
          };
        }
      }
      return state;
    }
    default:
      throw new Error("Unrecognized action type");
  }
};

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
  const spruceConfig = useSpruceConfig();
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const title = isIssue ? "Add Issue" : "Add Suspected Issue";
  const issueString = isIssue ? "issue" : "suspected issue";
  const analyticsType = isIssue
    ? "Add Task Annotation Issue"
    : "Add Task Annotation Suspected Issue";

  const [addIssueModalState, dispatch] = useReducer(reducer, init());

  const [addAnnotation] = useMutation<
    AddAnnotationIssueMutation,
    AddAnnotationIssueMutationVariables
  >(ADD_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully added ${issueString}`);
      dispatch({
        type: "reset",
      });
      setSelectedRowKey(addIssueModalState.issueKey);
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
      url: addIssueModalState.url,
      issueKey: addIssueModalState.issueKey,
      confidenceScore: toDecimal(addIssueModalState.confidenceScore),
    };
    addAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
  };

  const handleCancel = () => {
    dispatch({
      type: "reset",
    });
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
                  disabled={!addIssueModalState.canSubmit}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </span>
            }
            enabled={!addIssueModalState.canSubmit}
          >
            You must complete the form before you can save.
          </Tooltip>
        </>
      }
    >
      <TextInput
        data-cy="url-text-area"
        label="URL"
        value={addIssueModalState.url}
        onChange={(e) =>
          dispatch({
            type: "setUrl",
            url: e.target.value,
            jiraURL: spruceConfig.jira.host,
          })
        }
      />
      <TextInput
        data-cy="issue-key-text-area"
        label="Display Text"
        value={addIssueModalState.issueKey}
        onChange={(e) =>
          dispatch({
            type: "setKey",
            issueKey: e.target.value,
          })
        }
      />
      <Accordion title="Advanced Options">
        <TextInput
          data-cy="confidence-level"
          label="Confidence Level"
          description="The confidence level of the issue. This is a number between 0 and 100 representing a percentage."
          value={addIssueModalState.confidenceScore}
          optional
          onChange={(e) =>
            dispatch({
              type: "setConfidenceScore",
              confidenceScore: e.target.value,
            })
          }
        />
      </Accordion>
    </Modal>
  );
};

const toDecimal = (value: string | null) => {
  if (value === null) {
    return null;
  }
  const number = parseFloat(value);
  if (Number.isNaN(number)) {
    return null;
  }
  return number / 100;
};
