import gql from "graphql-tag";

export const UPDATE_USER_SETTINGS = gql`
  mutation UpdateUserSettings($userSettings: UserSettingsInput!) {
    updateUserSettings(userSettings: $userSettings)
  }
`;
