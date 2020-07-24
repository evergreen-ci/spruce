import gql from "graphql-tag";

export const HOSTS = gql`
  query Hosts($hostId: String) {
    hosts(hostId: $hostId) {
      filteredHostsCount
      totalHostsCount
      hosts {
        id
        distroId
        status
        startedBy
        hostUrl
        totalIdleTime
        uptime
        elapsed
        runningTask {
          id
          name
        }
      }
    }
  }
`;
