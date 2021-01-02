import { gql } from "@apollo/client";
import { PatchesPage } from "gql/fragments/patchesPage";

/* eslint-disable */
export const GET_USER_PATCHES = gql`
  query UserPatches($userId: String!, $patchesInput: PatchesInput!) {
    user(userId: $userId) {
      userId
      patches(patchesInput: $patchesInput) {
        ...PatchesPagePatches
      }
    }
  }
  ${PatchesPage.fragments.patches}
`;
