import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { render, fireEvent, queryHelpers } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { GET_USER } from "gql/queries";
import { GET_PATCH_FILTERS_EVENT_DATA } from "gql/queries/analytics/get-patch-filters-attributes";
import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
import { ContextProviders } from "context/Providers";
import wait from "waait";
import { act } from "react-dom/test-utils";

// @ts-ignore
window.newrelic = {
  addPageAction: jest.fn(),
};

jest.mock("react-router-dom", () => ({
  useLocation: jest
    .fn()
    .mockReturnValue({ search: "?page=0&variant=osx", pathname: "pathname" }),
  useHistory: jest.fn().mockReturnValue({ replace: jest.fn() }),
  useParams: jest.fn().mockReturnValue({ id: "123" }),
}));

test("Interacting with tracked HTML elements calls addPageAction function with correct params", async () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ContextProviders>
        <TaskFilters />
      </ContextProviders>
    </MockedProvider>
  );

  await act(async () => {
    await wait(0);
  });

  const inputValue = "cloud";
  fireEvent.input(
    queryHelpers.queryByAttribute("data-cy", container, "task-name-input"),
    { target: { value: inputValue } }
  );

  expect(window.newrelic.addPageAction).toHaveBeenCalledWith(
    "filterTasksByName",
    {
      patchId: "123",
      patchStatus: undefined,
      urlSearch: "?page=0&variant=osx",
      userId: "happy-user",
      value: inputValue,
    }
  );
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
