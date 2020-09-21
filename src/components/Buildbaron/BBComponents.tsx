import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { StyledLink } from "components/styles";
import { getDateCopy } from "utils/string";

interface titleProps {
  margin?: boolean;
}

export const BBTitle = styled(Subtitle)<titleProps>`
  margin-bottom: ${(props) => (props.margin ? "15px" : "5px")};
  margin-top: ${(props) => (props.margin ? "25px" : "20px")};
  // font-size: 16px;
  line-height: 24px;
  font-weight: bold;
`;

export const JiraTicketRow: React.FC<{
  jiraKey: String;
  fields;
}> = ({ jiraKey, fields }) => {
  const url = `https://jira.mongodb.org/browse/${jiraKey}`;
  return (
    <div>
      <JiraSummaryLink href={url} data-cy="jira-link">
        {jiraKey}: {fields.summary} {"   "}
      </JiraSummaryLink>

      <StyledBadge variant="lightgray">{fields.status.name}</StyledBadge>

      <MetaDataWrapper>
        <JiraTicketMetadata>
          Created: {getDateCopy(fields.created, null, true)}
        </JiraTicketMetadata>
        <JiraTicketMetadata>
          Updated: {getDateCopy(fields.updated, null, true)}
        </JiraTicketMetadata>
        <JiraTicketMetadata>
          {fields.assigneeDisplayName
            ? `Assignee: ${fields.assigneeDisplayName}`
            : "Unassigned"}{" "}
        </JiraTicketMetadata>
      </MetaDataWrapper>
    </div>
  );
};

const JiraSummaryLink = styled(StyledLink)`
  font-weight: bold;
  margin-right: 15px;
  font-size: 14px;
  line-height: 20px;
  color: ${uiColors.blue.base} !important;
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

const JiraTicketMetadata = styled.div`
  color: ${uiColors.gray.dark2} !important;
  font-size: 12px;
  line-height: 20px;
`;

export const TitleAndButtons = styled.div`
  margin-left: 15px;
`;
