import { gql } from "@apollo/client";

export const GET_CREATED_TICKETS = gql`
  query GetCreatedTickets($taskId: String!) {
    bbGetCreatedTickets(taskId: $taskId) {
      key
      fields {
        summary
        assigneeDisplayName
        resolutionName
        created
        updated
        status {
          id
          name
        }
      }
    }
  }
`;
