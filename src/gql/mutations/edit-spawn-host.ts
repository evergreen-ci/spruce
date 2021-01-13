import { gql } from "@apollo/client";

export const EDIT_SPAWN_HOST = gql`
  mutation EditSpawnHost(
    $hostId: String!
    $displayName: String
    $addedInstanceTags: [InstanceTagInput!]
    $deletedInstanceTags: [InstanceTagInput!]
    $volumeId: String
    $instanceType: String
    $expiration: Time
    $noExpiration: Boolean
    $servicePassword: String
  ) {
    editSpawnHost(
      spawnHost: {
        hostId: $hostId
        displayName: $displayName
        addedInstanceTags: $addedInstanceTags
        deletedInstanceTags: $deletedInstanceTags
        volume: $volumeId
        instanceType: $instanceType
        expiration: $expiration
        noExpiration: $noExpiration
        servicePassword: $servicePassword
      }
    ) {
      id
      displayName
      status
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
      noExpiration
      expiration
    }
  }
`;
