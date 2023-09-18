import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
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
