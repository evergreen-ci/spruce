import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { ApolloMock } from "types/gql";

export const getSpruceConfigMock: ApolloMock<
  SpruceConfigQuery,
  SpruceConfigQueryVariables
> = {
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
          defaultProject: "evergreen",
          __typename: "UIConfig",
        },
        jira: { host: "jira.mongodb.org", __typename: "JiraConfig" },
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
