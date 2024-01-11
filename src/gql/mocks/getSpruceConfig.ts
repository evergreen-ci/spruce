import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { SPRUCE_CONFIG } from "gql/queries";
import { ApolloMock } from "types/gql";

export const getSpruceConfigMock: ApolloMock<
  SpruceConfigQuery,
  SpruceConfigQueryVariables
> = {
  request: {
    query: SPRUCE_CONFIG,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        bannerTheme: "warning",
        banner: "",
        ui: {
          defaultProject: "evergreen",
          __typename: "UIConfig",
        },
        containerPools: {
          pools: [
            {
              distro: "localhost",
              id: "test-pool",
              maxContainers: 5,
              port: 1234,
            },
          ],
        },
        keys: [
          {
            name: "fake_key",
            location: "/path/to/key",
          },
        ],
        jira: {
          host: "jira.mongodb.org",
          __typename: "JiraConfig",
          email: "test@example.com",
        },
        providers: {
          aws: {
            maxVolumeSizePerUser: 1500,
            pod: null,
            __typename: "AWSConfig",
          },
          __typename: "CloudProviderConfig",
        },
        slack: {
          name: "everygreen_slack",
        },
        spawnHost: {
          spawnHostsPerUser: 6,
          unexpirableHostsPerUser: 2,
          unexpirableVolumesPerUser: 1,
          __typename: "SpawnHostConfig",
        },
        __typename: "SpruceConfig",
      },
    },
  },
};

export const getUserSettingsMock: ApolloMock<
  UserSettingsQuery,
  UserSettingsQueryVariables
> = {
  request: {
    query: SPRUCE_CONFIG,
    variables: null,
  },
  result: {
    data: {
      userSettings: {
        __typename: "UserSettings",
        dateFormat: "MM/DD/YYYY",
        githubUser: {
          lastKnownAs: "user",
          __typename: "GithubUser",
        },
        notifications: {
          __typename: "Notifications",
          buildBreak: "",
          patchFinish: "",
          patchFirstFailure: "",
          spawnHostExpiration: "",
          spawnHostOutcome: "",
        },
        region: "us-east-1",
        slackMemberId: "1234",
        slackUsername: "user",
        timezone: "America/New_York",
        useSpruceOptions: {
          __typename: "UseSpruceOptions",
          hasUsedMainlineCommitsBefore: true,
          spruceV1: true,
          hasUsedSpruceBefore: true,
        },
      },
    },
  },
};
