import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import MatchMediaMock from "jest-matchmedia-mock";
import { GET_BUILD_BARON } from "gql/queries";
import { useBuildBaronVariables } from "../useBuildBaronVariables";

const Provider = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);
describe("useBuildBaronVariables", () => {
  let matchMedia;
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });
  it("the BuildBaron tab renders when the task is failed", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBuildBaronVariables({
          taskId: taskId1,
          execution,
          taskStatus: "failed",
        }),
      { wrapper: Provider }
    );

    await waitForNextUpdate();
    await waitForNextUpdate();
    expect(result.current.showBuildBaron).toBeTruthy();
  });

  it("the BuildBaron tab doesn't render when the task is successful", async () => {
    const { result } = renderHook(
      () =>
        useBuildBaronVariables({
          taskId: taskId1,
          execution,
          taskStatus: "success",
        }),
      { wrapper: Provider }
    );
    expect(result.current.showBuildBaron).toBeFalsy();
  });

  it("the BuildBaron tab doesn't render when the buildBaron is not configured", async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useBuildBaronVariables({
          taskId: taskId2,
          execution,
          taskStatus: "failed",
        }),
      { wrapper: Provider }
    );
    await waitForNextUpdate();
    expect(result.current.showBuildBaron).toBeFalsy();
  });
});

const taskId1 = "spruce_ubuntu1604_e2e_test_1";
const taskId2 = "spruce_ubuntu1604_e2e_test_2";
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

const buildBaronQueryNotConfigured = {
  buildBaron: {
    buildBaronConfigured: false,
    searchReturnInfo: {},
  },
};

const mocks = [
  {
    request: {
      query: GET_BUILD_BARON,
      variables: {
        taskId: taskId1,
        execution,
      },
    },
    result: {
      data: buildBaronQuery,
    },
  },
  {
    request: {
      query: GET_BUILD_BARON,
      variables: {
        taskId2,
        execution,
      },
    },
    result: {
      data: buildBaronQueryNotConfigured,
    },
  },
  {
    request: {
      query: GET_BUILD_BARON,
      variables: {
        taskId: "spruce_ubuntu1604_e2e_test_2",
        execution: 1,
      },
    },
    result: {
      data: buildBaronQueryNotConfigured,
    },
  },
];
