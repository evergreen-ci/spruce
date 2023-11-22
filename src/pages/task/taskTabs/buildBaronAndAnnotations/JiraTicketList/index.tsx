import { CreatedTicketsQuery } from "gql/generated/types";
import JiraTicketRow from "./JiraTicketRow";

type CreatedTickets = CreatedTicketsQuery["bbGetCreatedTickets"];

const JiraTicketList: React.FC<{
  jiraIssues: CreatedTickets;
}> = ({ jiraIssues }) => (
  <>
    {jiraIssues.map(({ fields, key }) => (
      <JiraTicketRow jiraKey={key} fields={fields} key={key} />
    ))}
  </>
);

export default JiraTicketList;
