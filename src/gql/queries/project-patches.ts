import { gql } from "@apollo/client";
import { PatchesPage } from "gql/fragments/patchesPage";

/* eslint-disable */
export const GET_PROJECT_PATCHES = gql`
  query ProjectPatches($projectId: String!, $patchesInput: PatchesInput!) {
    project(projectId: $projectId) {
      id
      displayName
      patches(patchesInput: $patchesInput) {
        ...PatchesPagePatches
      }
    }
  }
  ${PatchesPage.fragments.patches}
`;
