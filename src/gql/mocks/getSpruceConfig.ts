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
        __typename: "SpruceConfig",
        banner: "",
        bannerTheme: "warning",
        jira: { __typename: "JiraConfig", host: "jira.mongodb.org" },
        providers: {
          __typename: "CloudProviderConfig",
          aws: {
            __typename: "AWSConfig",
            maxVolumeSizePerUser: 1500,
            pod: null,
          },
        },
        slack: {
          name: "everygreen_slack",
        },
        spawnHost: {
          __typename: "SpawnHostConfig",
          spawnHostsPerUser: 6,
          unexpirableHostsPerUser: 2,
          unexpirableVolumesPerUser: 1,
        },
        ui: {
          __typename: "UIConfig",
          defaultProject: "evergreen",
        },
      },
    },
  },
};
