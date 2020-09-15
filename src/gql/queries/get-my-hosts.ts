import { gql } from "@apollo/client";

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
      instanceTags {
        key
        value
        canBeModified
      }
      noExpiration
      provider
      status
      startedBy
      tag
      user
      uptime
      availabilityZone
    }
  }
`;
