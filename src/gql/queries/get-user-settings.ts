import gql from "graphql-tag";

export const GET_USER_SETTINGS = gql`
  query GetUserSettings {
    userSettings {
      timezone
      region
      slackUsername
      notifications {
        buildBreak
        commitQueue
        patchFinish
        patchFirstFailure
        spawnHostExpiration
        spawnHostOutcome
      }
      githubUser {
        lastKnownAs
      }
    }
  }
`;
