import gql from "graphql-tag";

export interface Patch {
  id: string;
  description: string;
  projectID: string;
  githash: string;
  patchNumber: number;
  author: string;
  version: string;
  status: string;
  activated: string;
  alias: string;
  duration: {
    makespan: string;
    timeTaken: string;
  };
  time: {
    started?: string;
    finished?: string;
    submittedAt: string;
  };
}

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
