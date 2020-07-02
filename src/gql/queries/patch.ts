import gql from "graphql-tag";

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
      canEnqueue
    }
  }
`;

export const GET_PATCH_CONFIGURE = gql`
  query ConfigurePatch($id: String!) {
    patch(id: $id) {
      id
      description
      author
      status
      activated
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
