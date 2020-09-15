import { gql } from "@apollo/client";

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
      commitQueuePosition
      baseVersionID
      duration {
        makespan
        timeTaken
      }
      time {
        started
        submittedAt
        finished
      }
      variantsTasks {
        name
        tasks
      }
      canEnqueueToCommitQueue
      isPerfPluginEnabled
    }
  }
`;

export const GET_PATCH_CONFIGURE = gql`
  query ConfigurePatch($id: String!) {
    patch(id: $id) {
      id
      description
      author
      alias
      status
      activated
      commitQueuePosition
      time {
        submittedAt
      }
      project {
        tasks
        variants {
          name
          displayName
          tasks
        }
      }
      variantsTasks {
        name
        tasks
      }
    }
  }
`;
