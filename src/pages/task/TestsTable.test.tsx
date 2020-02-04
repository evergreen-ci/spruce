import * as React from "react";
import { act } from "react-dom/test-utils";
import * as ReactDOM from "react-dom";
import { MockedProvider } from "@apollo/react-testing";
import { TestsTable } from "../../pages/task/TestsTable";
import { TESTS_QUERY } from "../../gql/queries";
import { MemoryRouter, Route } from "react-router";
import wait from "waait";

const taskTests = [
  {
    id: "59ef7a20a7798219e191cf82",
    status: "pass",
    testFile: "TestAgentSuite",
    duration: 0.039999961853027344,
    __typename: "TestResult"
  },
  {
    id: "59ef7a20a7798219e191cfad",
    status: "pass",
    testFile: "TestAgentSuite/TestCancelRunCommands",
    duration: 0,
    __typename: "TestResult"
  },
  {
    id: "59ef7a20a7798219e191cf67",
    status: "pass",
    testFile: "TestCommandSuite/TestShellExec",
    duration: 0.019999980926513672,
    __typename: "TestResult"
  }
];

const mocks = [
  {
    request: {
      query: TESTS_QUERY,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "ASC",
        cat: "STATUS",
        pageNum: 0,
        limitNum: 3
      }
    },
    result: () => {
      return {
        data: {
          taskTests
        }
      };
    }
  },
  {
    request: {
      query: TESTS_QUERY,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "ASC",
        cat: "TEST_NAME",
        pageNum: 0,
        limitNum: 3
      }
    },
    result: () => {
      return {
        data: {
          taskTests
        }
      };
    }
  }
];

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter>
      <MockedProvider mocks={mocks}>
        <Route path="/task/:taskID/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("It loads data on initial load when given valid query params", async () => {
  const div = document.createElement("div");
  const spy = jest.spyOn(mocks[0], "result");

  ReactDOM.render(
    <MemoryRouter
      initialEntries={[
        {
          pathname:
            "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests",
          search: "?category=STATUS&sort=1",
          hash: "",
          key: "djuhdk"
        }
      ]}
      initialIndex={0}
    >
      <MockedProvider mocks={mocks}>
        <Route path="/task/:taskID/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>,
    div
  );
  await act(async () => {
    await wait(10);
  });
  ReactDOM.unmountComponentAtNode(div);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

it("It loads data with TEST_FILE ASC when given invalid query param", async () => {
  const div = document.createElement("div");
  const spy = jest.spyOn(mocks[1], "result");

  ReactDOM.render(
    <MemoryRouter
      initialEntries={[
        {
          pathname:
            "/task/mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33/tests",
          hash: "",
          key: "djuhdk"
        }
      ]}
      initialIndex={0}
    >
      <MockedProvider mocks={mocks}>
        <Route path="/task/:taskID/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>,
    div
  );
  await act(async () => {
    await wait(10);
  });
  ReactDOM.unmountComponentAtNode(div);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
