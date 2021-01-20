import React, { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon, { Size } from "@leafygreen-ui/icon";
import { Table, Popconfirm, Tooltip } from "antd";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { ErrorBoundary } from "components/ErrorBoundary";
import { useBannerDispatchContext } from "context/banners";
import {
  GetTaskQuery,
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { MOVE_ANNOTATION } from "gql/mutations/move-annotation";
import { REMOVE_ANNOTATION } from "gql/mutations/remove-annotation";
import { AnnotationTicketRow } from "./BBComponents";

type AnnotationTickets = GetTaskQuery["task"]["annotation"]["issues"];
type AnnotationTicket = AnnotationTickets[0];
interface Props {
  jiraIssues: AnnotationTickets;
  annotationId: string;
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
}

export const AnnotationTicketsTable: React.FC<Props> = ({
  annotationId,
  taskId,
  execution,
  userCanModify,
  jiraIssues,
  isIssue,
  selectedRowKey,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const issueString = isIssue ? "issue" : "suspected issue";
  const icon = <Icon glyph={isIssue ? "ArrowDown" : "ArrowUp"} />;
  const columns = [
    {
      title: "Ticket",
      render: (
        text: string,
        { issueKey, url, source, jiraTicket }: AnnotationTicket
      ): JSX.Element => (
        <AnnotationTicketRow
          issueKey={issueKey}
          url={url}
          source={source}
          jiraTicket={jiraTicket}
        />
      ),
    },
    {
      title: "Delete",
      render: (
        text: string,
        { issueKey, url }: AnnotationTicket
      ): JSX.Element => (
        <ConditionalWrapper
          condition={!userCanModify}
          wrapper={(children) => (
            <Tooltip title="You are not authorized to edit task annotations">
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
              <StyledButton
                size={Size.Small}
                data-cy={`move-btn-${issueKey}`}
                disabled={!userCanModify}
                glyph={icon}
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
              <StyledButton
                size="small"
                data-cy={`${issueKey}-delete-btn`}
                glyph={<Icon glyph="Trash" />}
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
      dispatchBanner.successBanner(`Successfully removed ${issueString}`);
    },
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error removing the ${issueString}: ${error.message}`
      );
    },
    refetchQueries: ["GetTask"],
  });

  const [moveAnnotation] = useMutation<
    MoveAnnotationIssueMutation,
    MoveAnnotationIssueMutationVariables
  >(MOVE_ANNOTATION, {
    onCompleted: () => {
      dispatchBanner.successBanner(
        `Successfully moved ${issueString} to ${
          isIssue ? "suspected issues" : "issues"
        }`
      );
    },
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error moving the ${issueString}: ${error.message}`
      );
    },
    refetchQueries: ["GetTask"],
  });

  const onClickRemove = (url, issueKey) => {
    const apiIssue = {
      url,
      issueKey,
    };
    removeAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });
  };

  const onClickMove = (url, issueKey) => {
    const apiIssue = {
      url,
      issueKey,
    };
    moveAnnotation({ variables: { annotationId, apiIssue, isIssue } });
  };

  // SCROLL TO added Issue
  const rowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (selectedRowKey && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  return (
    <TableWrapper>
      <ErrorBoundary>
        <Table
          tableLayout="fixed"
          data-test-id={isIssue ? "issues-table" : "suspected-issues-table"}
          dataSource={jiraIssues}
          rowKey={({ issueKey }) => issueKey}
          columns={columns}
          pagination={false}
          showHeader={false}
          rowSelection={{
            hideSelectAll: true,
            selectedRowKeys: [selectedRowKey],
            columnWidth: 0,
            renderCell: () => <span ref={rowRef} />,
          }}
        />
      </ErrorBoundary>
    </TableWrapper>
  );
};

export const TableWrapper = styled.div`
  margin-top: 5px;
`;
export const StyledText = styled.div`
  padding: 5px;
`;

const BtnContainer = styled.div`
  white-space: nowrap;
  padding: 20px;
  float: right;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
  margin-top: 8px;
  height: 28px;
`;
