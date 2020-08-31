import gql from "graphql-tag";

export const DISTRO_TASK_QUEUE = gql`
  query DistroTaskQueue($distroId: String!) {
    distroTaskQueue(distroId: $distroId) {
      id
      expectedDuration
      requester
      displayName
      project
      buildVariant
      priority
      version
    }
  }
`;
