import { CreatedTicketsQuery } from "gql/generated/types";
import JiraTicketRow from "./JiraTicketRow";

type CreatedTickets = CreatedTicketsQuery["bbGetCreatedTickets"];

const BuildBaronTable: React.FC<{
  jiraIssues: CreatedTickets;
}> = ({ jiraIssues }) => (
  <div>
    {jiraIssues.map(({ fields, key }) => (
      <JiraTicketRow jiraKey={key} fields={fields} key={key} />
    ))}
  </div>
);

export default BuildBaronTable;
