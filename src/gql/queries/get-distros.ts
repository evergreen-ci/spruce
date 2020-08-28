import { gql } from "@apollo/client";

export const GET_DISTROS = gql`
  query distros($onlySpawnable: Boolean!) {
    distros(onlySpawnable: $onlySpawnable) {
      name
      isVirtualWorkStation
    }
  }
`;
