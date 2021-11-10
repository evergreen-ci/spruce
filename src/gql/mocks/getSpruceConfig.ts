import { GET_SPRUCE_CONFIG } from "gql/queries";

export const getSpruceConfigMock = {
  request: {
    query: GET_SPRUCE_CONFIG,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        bannerTheme: "warning",
        banner: "",
        ui: {
          userVoice: "https://feedback.mongodb.com/forums/930019-evergreen",
          defaultProject: "evergreen",
          __typename: "UIConfig",
        },
        jira: { host: "jira.mongodb.org", __typename: "JiraConfig" },
        providers: {
          aws: { maxVolumeSizePerUser: 1500, __typename: "AWSConfig" },
          __typename: "CloudProviderConfig",
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
