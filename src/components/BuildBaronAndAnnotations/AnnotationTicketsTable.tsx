import React from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "@leafygreen-ui/icon";
import { Table, Popconfirm, Tooltip } from "antd";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { ErrorBoundary } from "components/ErrorBoundary";
import { useBannerDispatchContext } from "context/banners";
import {
  GetTaskQuery,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { REMOVE_ANNOTATION } from "gql/mutations/remove-annotation";
import { AnnotationTicketRow } from "./BBComponents";

type AnnotationTickets = GetTaskQuery["task"]["annotation"]["issues"];
type AnnotationTicket = AnnotationTickets[0];
interface Props {
  jiraIssues: AnnotationTickets;
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
}

export const AnnotationTicketsTable: React.FC<Props> = ({
  taskId,
  execution,
  userCanModify,
  jiraIssues,
  isIssue,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const columns = [
    {
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
      title: "Actions",
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
            {/* todo: add move button here */}
            <Popconfirm
              icon={null}
              placement="topRight"
              title="Delete this ticket?"
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
      dispatchBanner.successBanner(`Successfully removed issue`);
    },
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error removing the issue: ${error.message}`
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

  return (
    <TableWrapper>
      <ErrorBoundary>
        <Table
          data-test-id={isIssue ? "issues-table" : "suspected-issues-table"}
          dataSource={jiraIssues}
          rowKey={({ issueKey }) => issueKey}
          columns={columns}
          pagination={false}
          showHeader={false}
        />
      </ErrorBoundary>
    </TableWrapper>
  );
};

export const TableWrapper = styled.div`
  margin-top: 5px;
`;

const BtnContainer = styled.div`
  white-space: nowrap;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
`;
