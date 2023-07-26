import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon, { Size } from "@leafygreen-ui/icon";
import Tooltip from "@leafygreen-ui/tooltip";
import { Table } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Popconfirm from "components/Popconfirm";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import { AnnotationTicketRow } from "./AnnotationTicketRow";
import { AnnotationTickets, AnnotationTicket } from "./types";

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

const AnnotationTicketsTable: React.VFC<AnnotationTicketsProps> = ({
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

  const columns = [
    {
      render: ({
        confidenceScore,
        issueKey,
        jiraTicket,
        url,
      }: AnnotationTicket): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
          jiraTicket={jiraTicket}
          confidenceScore={confidenceScore}
          loading={loading}
        />
      ),
      title: "Ticket",
      width: "65%",
    },
    {
      render: ({
        confidenceScore,
        issueKey,
        url,
      }: AnnotationTicket): JSX.Element => (
        <ButtonContainer>
          {ConditionalWrapper({
            altWrapper: (children: JSX.Element) => (
              <Tooltip trigger={children}>
                You are not authorized to edit failure details
              </Tooltip>
            ),
            children: (
              <Button
                size={Size.Small}
                data-cy={`move-btn-${issueKey}`}
                disabled={!userCanModify}
                leftGlyph={<Icon glyph={isIssue ? "ArrowDown" : "ArrowUp"} />}
              >
                Move to {isIssue ? "suspected issues" : "issues"}
              </Button>
            ),
            condition: userCanModify,
            wrapper: (children: JSX.Element) => (
              <Popconfirm
                align="right"
                onConfirm={() => {
                  handleMove({ confidenceScore, issueKey, url });
                }}
                trigger={children}
              >
                Do you want to move this {issueString} to{" "}
                {isIssue ? "suspected issues" : "issues"}?
              </Popconfirm>
            ),
          })}
          {ConditionalWrapper({
            altWrapper: (children: JSX.Element) => (
              <Tooltip trigger={children}>
                You are not authorized to edit failure details
              </Tooltip>
            ),
            children: (
              <Button
                size="small"
                data-cy={`${issueKey}-delete-btn`}
                leftGlyph={<Icon glyph="Trash" />}
                disabled={!userCanModify}
              />
            ),
            condition: userCanModify,
            wrapper: (children: JSX.Element) => (
              <Popconfirm
                align="right"
                onConfirm={() => {
                  handleRemove(url, issueKey);
                }}
                trigger={children}
              >
                Do you want to delete this {issueString}?
              </Popconfirm>
            ),
          })}
        </ButtonContainer>
      ),
    },
  ];

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
      issueKey,
      url,
    };
    removeAnnotation({ variables: { apiIssue, execution, isIssue, taskId } });
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
    moveAnnotation({ variables: { apiIssue, execution, isIssue, taskId } });
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
  const rowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (selectedRowKey && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedRowKey]);

  return (
    <Table
      tableLayout="fixed"
      data-test-id={isIssue ? "issues-table" : "suspected-issues-table"}
      dataSource={jiraIssues}
      rowKey={({ issueKey }) => issueKey}
      columns={columns}
      pagination={false}
      showHeader={false}
      rowSelection={{
        columnWidth: 0,
        renderCell: (_, record) =>
          record.issueKey === selectedRowKey && <span ref={rowRef} />,
        selectedRowKeys: [selectedRowKey],
      }}
    />
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${size.xs};
`;

export default AnnotationTicketsTable;
