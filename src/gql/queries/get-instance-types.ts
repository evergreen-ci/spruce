import { gql } from "@apollo/client";

export const GET_INSTANCE_TYPES = gql`
  query InstanceTypes {
    instanceTypes
  }
`;
