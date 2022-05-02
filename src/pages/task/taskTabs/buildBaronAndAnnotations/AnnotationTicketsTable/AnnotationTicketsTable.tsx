import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import Icon, { Size } from "@leafygreen-ui/icon";
import Tooltip from "@leafygreen-ui/tooltip";
import { Table } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { Popconfirm } from "components/Popconfirm";
import { useToastContext } from "context/toast";
import {
  GetIssuesQuery,
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import { AnnotationTicketRow } from "./AnnotationTicketsRow";

type AnnotationTickets = GetIssuesQuery["task"]["annotation"]["issues"];
type AnnotationTicket = AnnotationTickets[0];
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

export const AnnotationTicketsTable: React.VFC<AnnotationTicketsProps> = ({
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

  // While fetching for JIRA tickets, display the information we already have (the issueKey and the url).
  const loadingColumns = [
    {
      title: "Ticket",
      render: ({
        issueKey,
        url,
        confidenceScore,
      }: AnnotationTicket): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
          confidenceScore={confidenceScore}
          loading
        />
      ),
    },
  ];

  // Once JIRA tickets have been fetched, display the complete information.
  const columns = [
    {
      title: "Ticket",
      width: "60%",
      render: ({
        issueKey,
        url,
        source,
        jiraTicket,
      }: AnnotationTicket): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
          source={source}
          jiraTicket={jiraTicket}
        />
      ),
    },
    {
      render: ({ issueKey, url }: AnnotationTicket): JSX.Element => (
        <>
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
                  handleMove(url, issueKey);
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
        </>
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

  const handleMove = (url: string, issueKey: string): void => {
    const apiIssue = {
      url,
      issueKey,
    };
    moveAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
    const analyticsType = isIssue
      ? "Move Annotation Issue"
      : "Move Annotation Suspected Issue";
    setSelectedRowKey(issueKey);
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
        block: "start",
      });
    }
  });

  return loading ? (
    <Table
      tableLayout="fixed"
      dataSource={jiraIssues}
      rowKey={({ issueKey }) => issueKey}
      columns={loadingColumns}
      pagination={false}
      showHeader={false}
    />
  ) : (
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
