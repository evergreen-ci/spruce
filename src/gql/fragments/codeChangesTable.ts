import { gql } from "@apollo/client";

/* eslint-disable */
export const CodeChangesTable = {
  fragments: {
    fileDiffs: gql`
      fragment CodeChangesTableFileDiffs on FileDiff {
        fileName
        additions
        deletions
        diffLink
        description
      }
    `,
  },
};
