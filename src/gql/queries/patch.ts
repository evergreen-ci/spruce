import gql from "graphql-tag";
import { Patch } from "types/patch";

export interface PatchQuery {
  patch: Patch;
}

export const GET_PATCH = gql`
  query Patch($id: String!) {
    patch(id: $id) {
      id
      description
      projectID
      githash
      patchNumber
      author
      version
      status
      activated
      alias
      taskCount
      duration {
        makespan
        timeTaken
      }
      time {
        started
        submittedAt
        finished
      }
    }
  }
`;
