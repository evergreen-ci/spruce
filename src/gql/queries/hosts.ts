import gql from "graphql-tag";

export const HOSTS = gql`
  query Hosts(
    $hostId: String
    $distroId: String
    $currentTaskId: String
    $statuses: [String!]
    $startedBy: String
    $sortBy: HostSortBy
    $sortDir: SortDirection
    $page: Int
    $limit: Int
  ) {
    hosts(
      hostId: $hostId
      distroId: $distroId
      currentTaskId: $currentTaskId
      statuses: $statuses
      startedBy: $startedBy
      sortBy: $sortBy
      sortDir: $sortDir
      page: $page
      limit: $limit
    ) {
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
        provider
        noExpiration
        runningTask {
          id
          name
        }
      }
    }
  }
`;
