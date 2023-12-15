import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { useAnnotationAnalytics } from "analytics";
import { useToastContext } from "context/toast";
import {
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import AnnotationTicketRowWithActions from "./AnnotationTicketRowWithActions";
import { AnnotationTickets } from "./types";

interface AnnotationTicketsListProps {
  jiraIssues: AnnotationTickets;
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (key: string) => void;
  loading: boolean;
}

const AnnotationTicketsList: React.FC<AnnotationTicketsListProps> = ({
  execution,
  isIssue,
  jiraIssues,
  loading,
  selectedRowKey,
  setSelectedRowKey,
  taskId,
  userCanModify,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const issueString = isIssue ? "issue" : "suspected issue";

  const [removeAnnotation] = useMutation<
    RemoveAnnotationIssueMutation,
    RemoveAnnotationIssueMutationVariables
  >(REMOVE_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully removed ${issueString}`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error removing the ${issueString}: ${error.message}`
      );
    },
    refetchQueries: ["SuspectedIssues", "Issues"],
  });

  const [moveAnnotation] = useMutation<
    MoveAnnotationIssueMutation,
    MoveAnnotationIssueMutationVariables
  >(MOVE_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(
        `Successfully moved ${issueString} to ${
          isIssue ? "suspected issues" : "issues"
        }.`
      );
    },
    onError(error) {
      dispatchToast.error(
        `There was an error moving the ${issueString}: ${error.message}`
      );
    },
    refetchQueries: ["SuspectedIssues", "Issues"],
  });

  const handleRemove = (url: string, issueKey: string): void => {
    const apiIssue = {
      url,
      issueKey,
    };
    removeAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
    const analyticsType = isIssue
      ? "Remove Annotation Issue"
      : "Remove Annotation Suspected Issue";
    annotationAnalytics.sendEvent({
      name: analyticsType,
    });
  };

  const handleMove = (apiIssue: {
    url: string;
    issueKey: string;
    confidenceScore: number;
  }): void => {
    moveAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
    const analyticsType = isIssue
      ? "Move Annotation Issue"
      : "Move Annotation Suspected Issue";
    setSelectedRowKey(apiIssue.issueKey);
    annotationAnalytics.sendEvent({
      name: analyticsType,
    });
  };

  // SCROLL TO added Issue
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRowKey && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedRowKey]);

  return (
    <div data-cy={isIssue ? "issues-list" : "suspected-issues-list"}>
      {jiraIssues.map((issue) => (
        <AnnotationTicketRowWithActions
          isIssue={isIssue}
          issueString={issueString}
          onMove={handleMove}
          onRemove={handleRemove}
          userCanModify={userCanModify}
          loading={loading}
          key={issue.issueKey}
          ref={issue.issueKey === selectedRowKey ? rowRef : null}
          selected={issue.issueKey === selectedRowKey}
          {...issue}
        />
      ))}
    </div>
  );
};

export default AnnotationTicketsList;
