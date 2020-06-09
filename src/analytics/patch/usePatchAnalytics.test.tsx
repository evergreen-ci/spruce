import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { usePatchAnalytics } from "analytics/patch/usePatchAnalytics";
import { MemoryRouter as Router } from "react-router-dom";
import { GET_USER, GET_PATCH, GET_PATCH_TASK_STATUSES } from "gql/queries";
import { GET_PATCH_EVENT_DATA } from "analytics/patch/query";
import { MockedProvider } from "@apollo/react-testing";

// @ts-ignore
window.newrelic = {
  addPageAction: jest.fn(),
};

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn().mockReturnValue({
    search: "?page=0&statuses=failed,success&taskName=cloud&variant=ubun",
    pathname: "pathname",
  }),
  useHistory: jest.fn().mockReturnValue({ replace: jest.fn() }),
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

const Wrapper: React.FC = ({ children }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Router>{children}</Router>
  </MockedProvider>
);

test("it works", () => {
  const { result, rerender } = renderHook(() => usePatchAnalytics(), {
    wrapper: Router,
  });

  result.current.sendEvent({ name: "Filter Tasks", filterBy: "taskName" });

  expect(window.newrelic.addPageAction).toHaveBeenCalledWith("Filter Tasks", {
    patchId: "123",
    patchStatus: undefined,
    object: "Patch",
    page: 0,
    statuses: ["failed", "success"],
    taskName: "cloud",
    variant: "ubun",
    userId: "happy-user",
    filterBy: "taskName",
  });
});

const patchId = "abc";
const mocks = [
  {
    request: {
      query: GET_USER,
    },
    result: {
      data: {
        user: {
          userId: "happy-user",
        },
      },
    },
  },
  {
    request: {
      query: GET_PATCH,
      variables: {
        id: patchId,
      },
    },
    result: {
      data: {
        patch: {
          id: patchId,
          status: "failed",
        },
      },
    },
  },
  {
    request: {
      query: GET_PATCH_EVENT_DATA,
      variables: {
        id: patchId,
      },
    },
    result: {
      data: {
        patch: {
          id: patchId,
          status: "failed",
        },
      },
    },
  },
  {
    request: {
      query: GET_PATCH_TASK_STATUSES,
      variables: {
        id: patchId,
      },
    },
    result: {
      data: {
        patch: {
          id: patchId,
          taskStatuses: ["failed"],
        },
      },
    },
  },
];
