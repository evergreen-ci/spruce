import {
  BuildVariantStatsQuery,
  BuildVariantStatsQueryVariables,
} from "gql/generated/types";
import { BUILD_VARIANTS_STATS } from "gql/queries";
import { ApolloMock } from "types/gql";

const mocks: ApolloMock<
  BuildVariantStatsQuery,
  BuildVariantStatsQueryVariables
>[] = [
  {
    request: {
      query: BUILD_VARIANTS_STATS,
      variables: { id: "version" },
    },
    result: {
      data: {
        version: {
          buildVariantStats: [
            {
              displayName: "Lint",
              statusCounts: [
                {
                  count: 1,
                  status: "dispatched",
                  __typename: "StatusCount",
                },
                {
                  count: 1,
                  status: "success",
                  __typename: "StatusCount",
                },
              ],
              variant: "lint",
              __typename: "GroupedTaskStatusCount",
            },
            {
              displayName: "Ubuntu 16.04",
              statusCounts: [
                {
                  count: 1,
                  status: "blocked",
                  __typename: "StatusCount",
                },
                {
                  count: 2,
                  status: "failed",
                  __typename: "StatusCount",
                },
                {
                  count: 1,
                  status: "known-issue",
                  __typename: "StatusCount",
                },
                {
                  count: 40,
                  status: "success",
                  __typename: "StatusCount",
                },
              ],
              variant: "ubuntu1604",
              __typename: "GroupedTaskStatusCount",
            },
            {
              displayName: "Ubuntu 16.04",
              statusCounts: [
                {
                  count: 4,
                  status: "started",
                  __typename: "StatusCount",
                },
              ],
              variant: "variant",
              __typename: "GroupedTaskStatusCount",
            },
          ],
          id: "5e4ff3abe3c3317e352062e4",
          __typename: "Version",
        },
      },
    },
  },
];

export { mocks };
