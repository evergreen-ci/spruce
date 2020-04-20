import gql from "graphql-tag";
import { Patch } from "../../types/patch";
export const GET_COMMIT_QUEUE = gql`
  query CommitQueue($id: String!) {
    commitQueue(id: $id) {
      ProjectID
      Queue {
        Issue
        EnqueueTime
        Patch {
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
  ProjectID: string;
  Queue: [
    {
      Issue: string;
      EnqueueTime: Date;
      Patch: Patch;
    }
  ];
}

export interface CommitQueueQuery {
  commitQueue: CommitQueue;
}
