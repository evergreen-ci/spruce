import React, { useState } from "react";
import styled from "@emotion/styled";
import Tooltip from "antd/es/tooltip";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { PlusButton } from "components/Spawn";
import { IssueLink } from "gql/generated/types";
import { AddIssueModal } from "./AddIssueModal";
import { AnnotationTicketsTable } from "./AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";

interface Props {
  taskId: string;
  execution: number;
  tickets: IssueLink[];
  isIssue: boolean;
  userModifyPermission: boolean;
}

export const AnnotationTickets: React.FC<Props> = ({
  tickets,
  taskId,
  execution,
  isIssue,
  userModifyPermission,
}) => {
  const title = isIssue ? "Issues" : "SuspectedIssues";
  const buttonText = isIssue ? "Add Issue" : "Add SuspectedIssue";

  const [
    isAddAnnotationModalVisible,
    setIsAddAnnotationModalVisible,
  ] = useState<boolean>(false);
  return (
    <>
      {tickets?.length && (
        <>
          <TitleAndButtons>
            <TicketsTitle>{title} </TicketsTitle>
            <ConditionalWrapper
              condition={!userModifyPermission}
              wrapper={(children) => (
                <Tooltip title="You are not authorized to edit task annotations">
                  <span>{children}</span>
                </Tooltip>
              )}
            >
              <StyledButton
                onClick={() => setIsAddAnnotationModalVisible(true)}
                data-cy="add-tag-button"
                disabled={!userModifyPermission}
              >
                {buttonText}
              </StyledButton>
            </ConditionalWrapper>
          </TitleAndButtons>
          <AnnotationTicketsTable jiraIssues={tickets} />{" "}
          <AddIssueModal
            dataCy="addIssueModal"
            visible={isAddAnnotationModalVisible}
            closeModal={() => setIsAddAnnotationModalVisible(false)}
            taskId={taskId}
            execution={execution}
            isIssue={isIssue}
          />
        </>
      )}
    </>
  );
};

const StyledButton = styled(PlusButton)`
  margin-top: 10px;
  margin-bottom: 10px;
`;
