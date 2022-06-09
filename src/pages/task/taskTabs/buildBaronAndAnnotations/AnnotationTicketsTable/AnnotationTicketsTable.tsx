import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon, { Size } from "@leafygreen-ui/icon";
import Tooltip from "@leafygreen-ui/tooltip";
import { Table } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { Popconfirm } from "components/Popconfirm";
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
  jiraIssues,
  taskId,
  execution,
  userCanModify,
  isIssue,
  selectedRowKey,
  setSelectedRowKey,
  loading,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const issueString = isIssue ? "issue" : "suspected issue";

  const columns = [
    {
      title: "Ticket",
      width: "65%",
      render: ({
        issueKey,
        url,
        jiraTicket,
        confidenceScore,
      }: AnnotationTicket): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
          jiraTicket={jiraTicket}
          confidenceScore={confidenceScore}
          loading={loading}
        />
      ),
    },
    {
      render: ({
        issueKey,
        url,
        confidenceScore,
      }: AnnotationTicket): JSX.Element => (
        <ButtonContainer>
          {ConditionalWrapper({
            condition: userCanModify,
            wrapper: (children: JSX.Element) => (
              <Popconfirm
                icon={null}
                placement="topRight"
                title={`Do you want to move this ${issueString} to ${
                  isIssue ? "suspected issues" : "issues"
                }?`}
                onConfirm={() => {
                  handleMove({ url, issueKey, confidenceScore });
                }}
                okText="Yes"
                cancelText="Cancel"
              >
                {children}
              </Popconfirm>
            ),
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
                Move To {isIssue ? "Suspected Issues" : "Issues"}
              </Button>
            ),
          })}
          {ConditionalWrapper({
            condition: userCanModify,
            wrapper: (children: JSX.Element) => (
              <Popconfirm
                icon={null}
                placement="topRight"
                title={`Do you want to delete this ${issueString}?`}
                onConfirm={() => {
                  handleRemove(url, issueKey);
                }}
                okText="Yes"
                cancelText="Cancel"
              >
                {children}
              </Popconfirm>
            ),
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
    refetchQueries: ["GetSuspectedIssues", "GetIssues"],
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
    refetchQueries: ["GetSuspectedIssues", "GetIssues"],
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
        renderCell: (_, record) =>
          record.issueKey === selectedRowKey && <span ref={rowRef} />,
        selectedRowKeys: [selectedRowKey],
        columnWidth: 0,
      }}
    />
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default AnnotationTicketsTable;
