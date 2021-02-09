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
        isWindows
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
      volumes {
        displayName
        id
      }
      homeVolume {
        displayName
      }
      noExpiration
      provider
      status
      startedBy
      tag
      user
      uptime
      displayName
      availabilityZone
    }
  }
`;
