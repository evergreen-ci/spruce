import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render, fireEvent, queryHelpers } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { GET_USER, GET_PATCH, GET_PATCH_TASK_STATUSES } from "gql/queries";
import { PatchTabs } from "pages/patch/PatchTabs";
import { ContextProviders } from "context/Providers";
import { GET_PATCH_EVENT_DATA } from "analytics/patch/query";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

/**
 * UNABLE TO GET THESE TESTS TO WORK AFTER 5 HOURS OF EFFORT
 * MADE A TICKET TO REVISIT INTEGRATION TESTS AT A LATER DATE
 * 1. BUGSNAG IS A PAIN BECAUSE IT CANNOT BE RENDERED IN TESTS - MUST FIND WAY AROUND BUGNSAG
 * 2. ANALYTICS EVENT NOT BEING TRIGGERED WHEN IT IS SUPPOSED TO BE; THEREFORE FAILING TEST
 */

// @ts-ignore
window.newrelic = {
  addPageAction: jest.fn(),
};

jest.mock("@bugsnag/js", () => ({
  start: jest.fn(),
  getPlugin: jest.fn().mockReturnValue({ createErrorBoundary: jest.fn() }),
}));

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn().mockReturnValue({
    search: "?page=0&statuses=failed,success&taskName=cloud&variant=ubun",
    pathname: "pathname",
  }),
  useHistory: jest.fn().mockReturnValue({ replace: jest.fn() }),
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

test("Interacting with tracked HTML elements calls addPageAction function with correct params", async () => {
  const history = createMemoryHistory();
  history.push(
    "/patch/123/tasks?page=0&statuses=failed,success&taskName=cloud&variant=ubun"
  );
  const { container } = render(
    <Router history={history}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContextProviders>
          <PatchTabs taskCount={10} />
        </ContextProviders>
      </MockedProvider>
    </Router>
  );

  // await act(async () => await wait(0));
  fireEvent.click(
    queryHelpers.queryByAttribute("data-cy", container, "changes-tab")
  );

  expect(window.newrelic.addPageAction).toHaveBeenCalledWith("Filter Tasks", {
    patchId: "123",
    patchStatus: undefined,
    object: "Patch",
    page: 0,
    statuses: ["failed", "success"],
    taskName: "cloud",
    variant: "ubun",
    userId: "happy-user",
    tab: "changes",
    // filterBy: "taskName",
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
