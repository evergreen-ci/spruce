import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import * as ReactDOM from "react-dom";
import { MockedProvider } from "@apollo/react-testing";
import { TestsTable } from "../../pages/task/TestsTable";
import { GET_TASK_TESTS } from "../../gql/queries/get-task-tests";
import { MemoryRouter, Route } from "react-router";
import wait from "waait";
import { fireEvent } from "@testing-library/react";

const testLog = {
  htmlDisplayURL: "",
  rawDisplayURL: "",
  __typename: "TestLog"
};
const taskTestsPageZero = [
  {
    id: "59ef7a20a7798219e191d106",
    status: "skip",
    testFile: "TestMetricsSuite/TestRunForIntervalAndSendMessages",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191d0f2",
    status: "skip",
    testFile: "TestMetricsSuite/TestCollectSubProcesses",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf82",
    status: "pass",
    testFile: "TestAgentSuite",
    duration: 0.039999961853027344,
    __typename: "TestResult",

    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf67",
    status: "pass",
    testFile: "TestCommandSuite/TestShellExec",
    duration: 0.019999980926513672,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf91",
    status: "pass",
    testFile: "TestAgentSuite/TestAbort",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cfad",
    status: "pass",
    testFile: "TestAgentSuite/TestCancelRunCommands",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a2117798219e191cfa3",
    status: "pass",
    testFile: "TestAgentSuite/TestAgentEndTaskShouldExit",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef71.0a7798219e191cf79",
    status: "pass",
    testFile: "TestAgentIntegrationSuite/TestAbortTask",
    duration: 0.1099998950958252,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798119e191cf50",
    status: "pass",
    testFile: "TestCommandSuite",
    duration: 0.06999993324279785,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf5e",
    status: "pass",
    testFile: "TestCommandSuite/TestS3Copy",
    duration: 0.039999961853027344,
    __typename: "TestResult",
    logs: testLog
  }
];
const taskTestsPageOne = [
  {
    id: "59ef7a20a7798219e191cf10",
    status: "pass",
    testFile: "TestAgentSuite/TestAbort",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cfde",
    status: "pass",
    testFile: "TestAgentSuite/TestFinishTaskEndTaskError",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cff9",
    status: "pass",
    testFile: "TestAgentSuite/TestRunPostTaskCommands",
    duration: 0.019999980926513672,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cfa3",
    status: "pass",
    testFile: "TestAgentSuite/TestAgentEndTaskShouldExit",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191d005",
    status: "pass",
    testFile: "TestAgentSuite/TestRunPreTaskCommands",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cff0",
    status: "pass",
    testFile: "TestAgentSuite/TestNextTaskResponseShouldExit",
    duration: 0,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf79",
    status: "pass",
    testFile: "TestAgentIntegrationSuite/TestAbortTask",
    duration: 0.1099998950958252,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf50",
    status: "pass",
    testFile: "TestCommandSuite",
    duration: 0.06999993324279785,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf2x",
    status: "pass",
    testFile: "TestCommandSuite/TestS3Copy",
    duration: 0.039999961853027344,
    __typename: "TestResult",
    logs: testLog
  },
  {
    id: "59ef7a20a7798219e191cf71",
    status: "pass",
    testFile: "TestAgentIntegrationSuite",
    duration: 0.11999988555908203,
    __typename: "TestResult",
    logs: testLog
  }
];

const mocks = [
  {
    request: {
      query: GET_TASK_TESTS,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "ASC",
        cat: "STATUS",
        pageNum: 0,
        limitNum: 10
      }
    },
    result: () => {
      return {
        data: {
          taskTests: taskTestsPageZero
        }
      };
    }
  },
  {
    request: {
      query: GET_TASK_TESTS,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "ASC",
        cat: "TEST_NAME",
        pageNum: 0,
        limitNum: 10
      }
    },
    result: () => {
      return {
        data: {
          taskTests: taskTestsPageZero
        }
      };
    }
  },
  {
    request: {
      query: GET_TASK_TESTS,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "ASC",
        cat: "TEST_NAME",
        pageNum: 1,
        limitNum: 10
      }
    },
    result: () => {
      return {
        data: {
          taskTests: taskTestsPageOne
        }
      };
    }
  },
  {
    request: {
      query: GET_TASK_TESTS,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "DESC",
        cat: "STATUS",
        pageNum: 0,
        limitNum: 10
      }
    },
    result: () => {
      return {
        data: {
          taskTests: taskTestsPageZero
        }
      };
    }
  },
  {
    request: {
      query: GET_TASK_TESTS,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "ASC",
        cat: "STATUS",
        pageNum: 1,
        limitNum: 10
      }
    },
    result: () => {
      return {
        data: {
          taskTests: taskTestsPageOne
        }
      };
    }
  },
  {
    request: {
      query: GET_TASK_TESTS,
      variables: {
        id:
          "mci_windows_test_agent_8a4f834ba24ddf91f93d0a96b90452e9653f4138_17_10_23_21_58_33",
        dir: "DESC",
        cat: "STATUS",
        pageNum: 1,
        limitNum: 10
      }
    },
    result: () => {
      return {
        data: {
          taskTests: taskTestsPageOne
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
        <Route path="/task/:id/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

it("Requests descending data when clicking on active ascending tab", async () => {
  const spy = jest.spyOn(mocks[0], "result");
  const spyOppDir = jest.spyOn(mocks[3], "result");

  const { getByText } = render(
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
        <Route path="/task/:id/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>
  );
  await act(async () => {
    await wait(50);
  });
  fireEvent.click(getByText("Status"));
  await act(async () => {
    await wait(50);
  });
  expect(spy).toHaveBeenCalled();
  expect(spyOppDir).toHaveBeenCalled();
  cleanup();
  spy.mockRestore();
  spyOppDir.mockRestore();
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
        <Route path="/task/:id/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>,
    div
  );
  await act(async () => {
    await wait(50);
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
        <Route path="/task/:id/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>,
    div
  );
  await act(async () => {
    await wait(50);
  });
  ReactDOM.unmountComponentAtNode(div);
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

it("It loads second page when scrolling to the bottom of the table", async () => {
  const div = document.createElement("div");
  const spy = jest.spyOn(mocks[1], "result");
  const spyNextPage = jest.spyOn(mocks[2], "result");

  const { container } = render(
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
        <Route path="/task/:id/:tab?">
          <TestsTable />
        </Route>
      </MockedProvider>
    </MemoryRouter>
  );
  await act(async () => {
    await wait(50);
  });

  fireEvent.scroll(container.querySelector(".ant-table-body"), {
    scrollY: 1000
  });
  await act(async () => {
    await wait(50);
  });
  ReactDOM.unmountComponentAtNode(div);
  expect(spy).toHaveBeenCalled();
  expect(spyNextPage).toHaveBeenCalled();
  cleanup();
  spy.mockRestore();
  spyNextPage.mockRestore();
});
