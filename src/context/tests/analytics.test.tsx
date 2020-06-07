import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { GET_PATCH_TASK_STATUSES } from "gql/queries";
import { GET_PATCH_FILTERS_EVENT_DATA } from "gql/queries/analytics/get-patch-filters-attributes";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
import { ContextProviders } from "context/Providers";

test("loads and displays greeting", async () => {
  render(
    <MockedProvider mocks={mocks}>
      <ContextProviders>
        <TaskFilters />
      </ContextProviders>
    </MockedProvider>
  );

  //   fireEvent.input()

  //   fireEvent.click(screen.getByText("Load Greeting"));

  //   await waitFor(() => screen.getByRole("heading"));

  //   expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  //   expect(screen.getByRole("button")).toHaveAttribute("disabled");
});

const patchId = "abc";
const mocks = [
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
          taskStatuses: ["failed", "success"],
          baseTaskStatuses: ["success"],
        },
      },
    },
  },
  {
    request: {
      query: GET_PATCH_FILTERS_EVENT_DATA,
      variables: {
        id: patchId,
      },
    },
    result: {
      data: {
        patch: {
          status: "failed",
        },
      },
    },
  },
];
