import { gql } from "@apollo/client";

export const ADD_ANNOTATION = gql`
  mutation AddAnnotationIssue(
    $taskId: String!
    $execution: Int!
    $apiIssue: IssueLinkInput!
    $isIssue: Boolean!
  ) {
    addAnnotationIssue(
      taskId: $taskId
      execution: $execution
      apiIssue: $apiIssue
      isIssue: $isIssue
    )
  }
`;
