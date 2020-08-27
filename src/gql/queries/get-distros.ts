import gql from "graphql-tag";

export const GET_DISTROS = gql`
  query distros($onlySpawnable: Boolean!) {
    distros(onlySpawnable: $onlySpawnable) {
      name
    }
  }
`;
