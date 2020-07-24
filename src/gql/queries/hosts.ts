import gql from "graphql-tag";

export const HOSTS = gql`
  query Hosts($hostId: String, $page: Int, $limit: Int) {
    hosts(hostId: $hostId, page: $page, limit: $limit) {
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
