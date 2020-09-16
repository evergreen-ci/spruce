import { gql } from "@apollo/client";

export const FILE_JIRA_TICKET = gql`
  mutation bbCreateTicket($taskId: String!) {
    bbCreateTicket(taskId: $taskId)
  }
`;
