import { gql } from "@apollo/client";

export const EDIT_SPAWN_HOST = gql`
  mutation EditSpawnHost(
    $hostId: String!
    $displayName: String
    $addedInstanceTags: [InstanceTagInput!]
    $deletedInstanceTags: [InstanceTagInput!]
    $volume: String
    $instanceType: String
    $expiration: Time
    $noExpiration: Boolean
  ) {
    editSpawnHost(
      spawnHost: {
        hostId: $hostId
        displayName: $displayName
        addedInstanceTags: $addedInstanceTags
        deletedInstanceTags: $deletedInstanceTags
        volume: $volume
        instanceType: $instanceType
        expiration: $expiration
        noExpiration: $noExpiration
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
