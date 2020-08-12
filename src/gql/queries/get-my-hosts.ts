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
      instanceType
      noExpiration
      status
      tag
      user
      uptime
    }
  }
`;
