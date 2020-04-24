import gql from "graphql-tag";
import { Patch } from "types/patch";
export const GET_COMMIT_QUEUE = gql`
  query CommitQueue($id: String!) {
    commitQueue(id: $id) {
      projectId
      queue {
        issue
        enqueueTime
        patch {
          id
          author
          description
          moduleCodeChanges {
            rawLink
            fileDiffs {
              fileName
              additions
              deletions
              diffLink
            }
          }
        }
      }
    }
  }
`;

export interface CommitQueue {
  projectId: string;
  queue: [
    {
      issue: string;
      enqueueTime: Date;
      patch: Patch;
    }
  ];
}

export interface CommitQueueQuery {
  commitQueue: CommitQueue;
}
