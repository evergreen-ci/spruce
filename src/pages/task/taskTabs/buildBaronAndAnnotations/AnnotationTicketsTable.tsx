import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon, { Size } from "@leafygreen-ui/icon";
import { Table, Popconfirm, Tooltip } from "antd";
import { useAnnotationAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  GetIssuesQuery,
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
  IssueLink,
} from "gql/generated/types";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import {
  AnnotationTicketRow,
  LoadingAnnotationTicketRow,
} from "./BBComponents";

type AnnotationTickets = GetIssuesQuery["task"]["annotation"]["issues"];
type AnnotationTicket = AnnotationTickets[0];

interface AnnotationTicketsProps {
  jiraIssues: AnnotationTickets;
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

export const AnnotationTicketsTable: React.FC<AnnotationTicketsProps> = ({
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
  const icon = <Icon glyph={isIssue ? "ArrowDown" : "ArrowUp"} />;

  // The annotationIssues contains the issueKey and the url, so it can be displayed while fetching for complete
  // ticket info.
  const loadingColumns = [
    {
      title: "Ticket",
      render: ({ issueKey, url }: IssueLink): JSX.Element => (
        <LoadingAnnotationTicketRow issueKey={issueKey} url={url} />
      ),
    },
  ];

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
        <ConditionalWrapper
          condition={!userCanModify}
          wrapper={(children) => (
            <Tooltip title="You are not authorized to edit failure details">
              <span>{children}</span>
            </Tooltip>
          )}
        >
          <BtnContainer>
            <Popconfirm
              icon={null}
              placement="topRight"
              title={`Do you want to move this ${issueString} to ${
                isIssue ? "suspected issues" : "issues"
              }?`}
              onConfirm={() => {
                onClickMove(url, issueKey);
              }}
              okText="Yes"
              cancelText="Cancel"
            >
              {/* @ts-expect-error */}
              <StyledButton
                size={Size.Small}
                data-cy={`move-btn-${issueKey}`}
                disabled={!userCanModify}
                leftGlyph={icon}
              >
                <StyledText>
                  Move To {isIssue ? "Suspected Issues" : "Issues"}
                </StyledText>
              </StyledButton>
            </Popconfirm>

            <Popconfirm
              icon={null}
              placement="topRight"
              title={`Do you want to delete this ${issueString}?`}
              onConfirm={() => {
                onClickRemove(url, issueKey);
              }}
              okText="Yes"
              cancelText="Cancel"
            >
              {/* @ts-expect-error */}
              <StyledButton
                size="small"
                data-cy={`${issueKey}-delete-btn`}
                leftGlyph={<Icon glyph="Trash" />}
                disabled={!userCanModify}
              />
            </Popconfirm>
          </BtnContainer>
        </ConditionalWrapper>
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

  const onClickRemove = (url: string, issueKey: string): void => {
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

  const onClickMove = (url: string, issueKey: string): void => {
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

  console.log(jiraIssues);

  if (!jiraIssues.length) {
    return null;
  }

  return loading ? (
    <TableWrapper>
      <Table
        tableLayout="fixed"
        dataSource={jiraIssues}
        rowKey={({ issueKey }) => issueKey}
        columns={loadingColumns}
        pagination={false}
        showHeader={false}
      />
    </TableWrapper>
  ) : (
    <TableWrapper>
      <Table
        tableLayout="fixed"
        data-test-id={isIssue ? "issues-table" : "suspected-issues-table"}
        dataSource={jiraIssues}
        rowKey={({ issueKey }) => issueKey}
        columns={columns}
        pagination={false}
        showHeader={false}
        rowSelection={{
          renderCell: (checked, record) =>
            record.issueKey === selectedRowKey && <span ref={rowRef} />,
          selectedRowKeys: [selectedRowKey],
          columnWidth: 0,
        }}
      />
    </TableWrapper>
  );
};

// CREATED TICKETS
interface CreatedTicketsProps {
  createdIssues: AnnotationTickets;
}

export const CustomCreatedTicketsTable: React.FC<CreatedTicketsProps> = ({
  createdIssues,
}) => {
  const columns = [
    {
      title: "Ticket",
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
  ];

  return (
    <TableWrapper>
      <Table
        tableLayout="fixed"
        data-test-id="created-issues-table"
        dataSource={createdIssues}
        rowKey={({ issueKey }) => issueKey}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </TableWrapper>
  );
};

export const TableWrapper = styled.div`
  margin-top: ${size.xxs};
  margin-left: ${size.s};
`;
export const StyledText = styled.div`
  padding: ${size.xxs};
`;

const BtnContainer = styled.div`
  white-space: nowrap;
  white-space: nowrap;
`;

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-left: ${size.xs};
  height: ${size.m};
`;
