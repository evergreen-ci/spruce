import React from "react";
import styled from "@emotion/styled/macro";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { Table } from "antd";
import { StyledLink } from "components/styles";
import { BuildBaron, JiraTicket } from "gql/generated/types";
import { getDateCopy } from "utils/string";

const { blue, gray } = uiColors;

export const BuildBaronTable: React.FC<{
  eventData: BuildBaron;
  timeZone: string;
}> = ({ eventData, timeZone }) => {
  const searchReturnInfo = eventData?.searchReturnInfo;
  const jiraIssues = searchReturnInfo?.issues;

  const columns = [
    {
      title: "Related tickets from JIRA",
      render: (text: string, { key, fields }: JiraTicket): JSX.Element => (
        <div>
          <JiraTicketRow jiraKey={key} fields={fields} timeZone={timeZone} />
        </div>
      ),
    },
  ];

  return (
    <Table
      data-test-id="build-baron-table"
      dataSource={jiraIssues}
      rowKey={({ key }) => key}
      columns={columns}
      pagination={false}
    />
  );
};

const JiraTicketRow: React.FC<{
  timeZone: string;
  jiraKey: String;
  fields;
}> = ({ jiraKey, fields, timeZone }) => {
  const url = `https://jira.mongodb.org/browse/${jiraKey}`;
  return (
    <div>
      <JiraSummaryLink href={url} data-cy="jira-link">
        {jiraKey}: {fields.summary} {"   "}
      </JiraSummaryLink>

      <StyledBadge variant="lightgray">{fields.status.name}</StyledBadge>

      <MetaDataWrapper>
        <JiraTicketMetadata>
          Created: {getDateCopy(fields.created, timeZone, true)}
        </JiraTicketMetadata>
        <JiraTicketMetadata>
          Updated: {getDateCopy(fields.updated, timeZone, true)}
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
  color: ${blue.base} !important;
`;

const StyledBadge = styled(Badge)`
  justify-content: center;
  width: 105px;
`;

const MetaDataWrapper = styled.div`
  margin-top: 7px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-row-gap: 0px;
  width: 65%;
`;

const JiraTicketMetadata = styled.div`
  color: ${gray.dark2} !important;
  font-size: 12px;
  line-height: 20px;
`;
