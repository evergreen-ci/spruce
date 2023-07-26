import {
  BuildVariantStatsQuery,
  BuildVariantStatsQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_STATS } from "gql/queries";
import { ApolloMock } from "types/gql";

const mocks: ApolloMock<
  BuildVariantStatsQuery,
  BuildVariantStatsQueryVariables
>[] = [
  {
    request: {
      query: GET_BUILD_VARIANTS_STATS,
      variables: { id: "version" },
    },
    result: {
      data: {
        version: {
          __typename: "Version",
          buildVariantStats: [
            {
              __typename: "GroupedTaskStatusCount",
              displayName: "Lint",
              statusCounts: [
                {
                  __typename: "StatusCount",
                  count: 1,
                  status: "dispatched",
                },
                {
                  __typename: "StatusCount",
                  count: 1,
                  status: "success",
                },
              ],
              variant: "lint",
            },
            {
              __typename: "GroupedTaskStatusCount",
              displayName: "Ubuntu 16.04",
              statusCounts: [
                {
                  __typename: "StatusCount",
                  count: 1,
                  status: "blocked",
                },
                {
                  __typename: "StatusCount",
                  count: 2,
                  status: "failed",
                },
                {
                  __typename: "StatusCount",
                  count: 1,
                  status: "known-issue",
                },
                {
                  __typename: "StatusCount",
                  count: 40,
                  status: "success",
                },
              ],
              variant: "ubuntu1604",
            },
            {
              __typename: "GroupedTaskStatusCount",
              displayName: "Ubuntu 16.04",
              statusCounts: [
                {
                  __typename: "StatusCount",
                  count: 4,
                  status: "started",
                },
              ],
              variant: "variant",
            },
          ],
          id: "5e4ff3abe3c3317e352062e4",
        },
      },
    },
  },
];

export { mocks };
