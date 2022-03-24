import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { context } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { variantHistoryMaxLength as maxLength } from "constants/history";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { GetTaskNamesForBuildVariantQuery } from "gql/generated/types";
import { GET_TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import {
  fireEvent,
  renderWithRouterMatch as render,
  waitFor,
} from "test_utils";
import { string } from "utils";
import ColumnHeaders from "./ColumnHeaders";

const { trimStringFromMiddle } = string;
const { HistoryTableProvider } = context;
const longTaskName = "really_really_really_really_really_really_long_task_name";
const trimmedTaskName = trimStringFromMiddle(longTaskName, maxLength);

const initialState: HistoryTableReducerState = {
  loadedCommits: [],
  processedCommits: [],
  processedCommitCount: 0,
  commitCache: new Map(),
  currentPage: 0,
  pageCount: 0,
  columns: [],
  historyTableFilters: [],
  commitCount: 10,
  visibleColumns: [],
  columnLimit: 7,
};

interface WrapperProps {
  children: React.ReactNode;
  state?: Partial<HistoryTableReducerState>;
  mocks?: MockedProviderProps["mocks"];
}

const wrapper: React.FC<WrapperProps> = ({ children, state, mocks }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

describe("columnHeaders (Variant History)", () => {
  it("renders an initial skeleton for the 7 column headers when loading", () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders projectId="evergreen" variantName="some_variant" />
    );
    const { queryAllByDataCy } = render(() => <Component />, {
      wrapper,
    });
    expect(queryAllByDataCy("loading-header-cell")).toHaveLength(7);
  });

  it("renders the column headers properly when not loading", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders projectId="evergreen" variantName="some_variant" />
    );
    const { queryAllByDataCy } = render(() => <Component />, {
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            visibleColumns: ["task1", "task2", "task3"],
          },
          mocks: [mock(["task1", "task2", "task3"])],
        }),
    });
    await waitFor(() => {
      expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });

    expect(queryAllByDataCy("header-cell")).toHaveLength(3);
  });

  it("should link to corresponding /task-history/:projectId/:taskName page", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders projectId="evergreen" variantName="some_variant" />
    );
    const { queryByRole, queryAllByDataCy } = render(() => <Component />, {
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            visibleColumns: ["task1"],
          },
          mocks: [mock(["task1"])],
        }),
    });
    await waitFor(() => {
      expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    expect(queryByRole("link")).toHaveAttribute(
      "href",
      "/task-history/evergreen/task1"
    );
  });

  it("should not show more column headers then the columnLimit", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders projectId="evergreen" variantName="some_variant" />
    );
    const { queryAllByDataCy } = render(() => <Component />, {
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            visibleColumns: ["task1", "task2", "task3", "task4", "task5"],
            columnLimit: 3,
          },
          mocks: [mock(["task1", "task2", "task3", "task4", "task5"])],
        }),
    });
    await waitFor(() => {
      expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    expect(queryAllByDataCy("header-cell")).toHaveLength(3);
  });
  it("should truncate the task name only if it is too long", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders projectId="evergreen" variantName="some_variant" />
    );
    const { queryByText, queryAllByDataCy } = render(() => <Component />, {
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            visibleColumns: [longTaskName, "task2"],
          },
          mocks: [mock([longTaskName, "task2"])],
        }),
    });

    await waitFor(() => {
      expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    expect(queryByText(longTaskName)).toBeNull();
    expect(queryByText("task2")).toBeVisible();
  });
  it("should show a tooltip with the full name when hovering over a truncated task name", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders projectId="evergreen" variantName="some_variant" />
    );
    const { queryByText, queryAllByDataCy } = render(() => <Component />, {
      wrapper: ({ children }) =>
        wrapper({
          children,
          state: {
            visibleColumns: [longTaskName],
          },
          mocks: [mock([longTaskName])],
        }),
    });
    await waitFor(() => {
      expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    fireEvent.mouseEnter(queryByText(trimmedTaskName));
    await waitFor(() => {
      expect(queryByText(longTaskName)).toBeVisible();
    });
  });
});

const mock = (
  buildVariants: GetTaskNamesForBuildVariantQuery["taskNamesForBuildVariant"]
) => ({
  request: {
    query: GET_TASK_NAMES_FOR_BUILD_VARIANT,
    variables: {
      projectId: "evergreen",
      buildVariant: "some_variant",
    },
  },
  result: {
    data: {
      taskNamesForBuildVariant: buildVariants,
    },
  },
});
