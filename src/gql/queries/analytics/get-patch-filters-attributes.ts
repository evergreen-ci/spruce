import gql from "graphql-tag";

/* eslint-disable */
export const GET_PATCH_FILTERS_EVENT_DATA = gql`
  query GetPatchFiltersEventData($id: String!) {
    patch(id: $id) {
      status @client
    }
  }
`;
