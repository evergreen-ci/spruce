import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { renderHook, act } from "@testing-library/react-hooks";
import MutationObserver from "mutation-observer";
import wait from "waait";
import { GET_BUILD_BARON } from "gql/queries";
import { useBuildBaronVariables } from "hooks/useBuildBaronVariables";
import { mockUUID } from "test_utils/test-utils";
import "test_utils/__mocks__/matchmedia.mock";

// @ts-ignore
global.MutationObserver = MutationObserver;

jest.mock("uuid");
beforeAll(mockUUID);
afterAll(() => jest.restoreAllMocks());

const taskId =
  "spruce_ubuntu1604_e2e_test_e0ece5ad52ad01630bdf29f55b9382a26d6256b3_20_08_26_19_20_41";
const execution = 1;

const buildBaronQuery = {
  buildBaron: {
    buildBaronConfigured: true,
    searchReturnInfo: {
      issues: [
        {
          key: "EVG-12345",
          fields: {
            summary: "This is a random Jira ticket title 1",
            assigneeDisplayName: null,
            resolutionName: "Declined",
            created: "2020-09-23T15:31:33.000+0000",
            updated: "2020-09-23T15:33:02.000+0000",
            status: {
              id: "5",
              name: "Resolved",
            },
          },
        },
        {
          key: "EVG-12346",
          fields: {
            summary: "This is a random Jira ticket title 2",
            assigneeDisplayName: "John Liu",
            resolutionName: "Declined",
            created: "2020-09-18T16:58:32.000+0000",
            updated: "2020-09-18T19:56:42.000+0000",
            status: {
              id: "6",
              name: "Closed",
            },
          },
        },
        {
          key: "EVG-12347",
          fields: {
            summary: "This is a random Jira ticket title 3",
            assigneeDisplayName: "Backlog - Evergreen Team",
            resolutionName: "Declined",
            created: "2020-09-18T17:04:06.000+0000",
            updated: "2020-09-18T19:56:29.000+0000",
            status: {
              id: "1",
              name: "Open",
            },
          },
        },
      ],
      search:
        '(project in (EVG)) and ( text~"docker\\\\-cleanup" ) order by updatedDate desc',
      source: "JIRA",
      featuresURL: "",
    },
  },
};

const mocks = [
  {
    request: {
      query: GET_BUILD_BARON,
      variables: {
        taskId,
        execution,
      },
    },
    result: {
      data: buildBaronQuery,
    },
  },
];

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

it("The BuildBaron tab renders when it needs to", async () => {
  const { result } = renderHook(
    () =>
      useBuildBaronVariables({
        taskId,
        execution,
        taskStatus: "failed",
      }),
    { wrapper: Provider }
  );
  await act(async () => {
    await wait(0);
  });

  expect(result.current.showBuildBaronTab).toBeTruthy();
});
