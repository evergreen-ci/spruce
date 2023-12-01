import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useAnnotationAnalytics } from "analytics";
import { size } from "constants/tokens";
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

const { gray } = palette;

interface AnnotationTicketsProps {
  jiraIssues: AnnotationTickets;
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (key: string) => void;
  loading: boolean;
}

const AnnotationTicketsTable: React.FC<AnnotationTicketsProps> = ({
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
        }`
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
  // Will add a span with a ref to the row that matches the selectedRowKey
  // And will scroll to that ref.
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
    <>
      {jiraIssues.map((issue) => (
        <ItemContainer
          key={issue.issueKey}
          ref={issue.issueKey === selectedRowKey ? rowRef : null}
          selected={issue.issueKey === selectedRowKey}
        >
          <AnnotationTicketRowWithActions
            isIssue={isIssue}
            issueString={issueString}
            onMove={handleMove}
            onRemove={handleRemove}
            userCanModify={userCanModify}
            loading={loading}
            {...issue}
          />
        </ItemContainer>
      ))}
    </>
  );
};
const ItemContainer = styled.div`
  padding: ${size.xs};
  ${({ selected }: { selected?: boolean }) =>
    selected &&
    `
    background-color: ${gray.light2};
  `}
`;

export default AnnotationTicketsTable;
