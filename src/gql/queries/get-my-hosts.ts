import gql from "graphql-tag";

export const GET_MY_HOSTS = gql`
  query MyHosts {
    myHosts {
      expiration
      distro {
        isVirtualWorkStation
        id
        user
        workDir
      }
      hostUrl
      homeVolumeID
      id
      instanceType
      noExpiration
      provider
      status
      startedBy
      tag
      user
      uptime
    }
  }
`;
