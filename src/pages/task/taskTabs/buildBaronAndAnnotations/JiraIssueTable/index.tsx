import { StyledLink } from "components/styles";
import { getJiraSearchUrl } from "constants/externalResources";
import { BuildBaron } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { TicketsTitle, NonTableWrapper } from "../BBComponents";
import { BuildBaronTable } from "../CreatedTicketsTable";

interface JiraIssueTableProps {
  bbData: BuildBaron;
}
const JiraIssueTable: React.VFC<JiraIssueTableProps> = ({ bbData }) => {
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const jiraSearchString = bbData?.searchReturnInfo?.search;
  const jqlEscaped = encodeURIComponent(jiraSearchString);
  const jiraSearchLink = getJiraSearchUrl(jiraHost, jqlEscaped);

  return (
    <>
      <NonTableWrapper>
        {/* @ts-expect-error */}
        <TicketsTitle>
          Related tickets from Jira
          <StyledLink data-cy="jira-search-link" href={jiraSearchLink}>
            {"  "}(Jira Search)
          </StyledLink>
        </TicketsTitle>
      </NonTableWrapper>
      {/* build baron related jira tickets */}
      <BuildBaronTable jiraIssues={bbData?.searchReturnInfo?.issues} />
    </>
  );
};

export default JiraIssueTable;
