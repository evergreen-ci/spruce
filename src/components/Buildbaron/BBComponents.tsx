import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "components/styles";
import { TicketFields } from "gql/generated/types";
import { getDateCopy } from "utils/string";

interface titleProps {
  margin?: boolean;
}

export const BBTitle = styled(Subtitle)<titleProps>`
  margin-bottom: ${(props) => (props.margin ? "15px" : "5px")};
  margin-top: ${(props) => (props.margin ? "25px" : "20px")};
  line-height: 24px;
  font-weight: bold;
`;

interface JiraTicketRowProps {
  jiraKey: string;
  fields: TicketFields;
}

export const JiraTicketRow: React.FC<JiraTicketRowProps> = ({
  jiraKey,
  fields,
}) => {
  const url = `https://jira.mongodb.org/browse/${jiraKey}`;
  return (
    <div>
      <JiraSummaryLink href={url} data-cy="jira-link">
        {jiraKey}: {fields.summary} {"   "}
      </JiraSummaryLink>

      <StyledBadge variant="lightgray">{fields.status.name}</StyledBadge>

      <MetaDataWrapper>
        <Disclaimer>
          Created: {getDateCopy(fields.created, null, true)}
        </Disclaimer>
        <Disclaimer>
          Updated: {getDateCopy(fields.updated, null, true)}
        </Disclaimer>
        <Disclaimer>
          {fields.assigneeDisplayName
            ? `Assignee: ${fields.assigneeDisplayName}`
            : "Unassigned"}{" "}
        </Disclaimer>
      </MetaDataWrapper>
    </div>
  );
};

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: 15px;
  font-size: 14px;
  line-height: 20px;
`;

const StyledBadge = styled(Badge)`
  justify-content: center;
  width: 105px;
`;

const MetaDataWrapper = styled.div`
  margin-top: 7px;
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 65%;
`;

export const TitleAndButtons = styled.div`
  margin-left: 15px;
`;
