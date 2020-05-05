import gql from "graphql-tag";

export const GET_USER_SETTINGS = gql`
  query GetUserSettings {
    userSettings {
      timezone
      region
      slackUsername

      notifications {
        patchFinish
        patchFirstFailure
        spawnHostOutcome
        spawnHostExpiration
        buildBreak
        commitQueue
      }
      githubUser {
        lastKnownAs
      }
    }
  }
`;
