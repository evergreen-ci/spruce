import { gql } from "@apollo/client";

export const MOVE_ANNOTATION = gql`
  mutation MoveAnnotationIssue(
    $annotationId: String!
    $apiIssue: IssueLinkInput!
    $isIssue: Boolean!
  ) {
    moveAnnotationIssue(
      annotationId: $annotationId
      apiIssue: $apiIssue
      isIssue: $isIssue
    )
  }
`;
