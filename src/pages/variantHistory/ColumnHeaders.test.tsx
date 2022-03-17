import { context } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import { variantHistoryMaxLength as maxLength } from "constants/history";
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
  selectedCommit: null,
};

interface WrapperProps {
  children: React.ReactNode;
  state?: Partial<HistoryTableReducerState>;
}

const wrapper: React.FC<WrapperProps> = ({ children, state }) => (
  <HistoryTableProvider initialState={{ ...initialState, ...state }}>
    {children}
  </HistoryTableProvider>
);

describe("columnHeaders (Variant History)", () => {
  it("renders an initial skeleton for the 7 column headers when loading", () => {
    const { queryAllByDataCy } = render(
      () => <ColumnHeaders projectId="evergreen" columns={[]} loading />,
      {
        wrapper,
      }
    );
    expect(queryAllByDataCy("loading-header-cell")).toHaveLength(7);
  });

  it("renders the column headers properly when not loading", async () => {
    const { queryAllByDataCy } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={["task1", "task2", "task3"]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: ["task1", "task2", "task3"],
            },
          }),
      }
    );
    expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    expect(queryAllByDataCy("header-cell")).toHaveLength(3);
  });

  it("should link to corresponding /task-history/:projectId/:taskName page", async () => {
    const { queryByRole } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={["task1"]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: ["task1"],
            },
          }),
      }
    );
    expect(queryByRole("link")).toHaveAttribute(
      "href",
      "/task-history/evergreen/task1"
    );
  });

  it("should truncate the task name only if it is too long", async () => {
    const { queryByText } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={[longTaskName, "task2"]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: [longTaskName, "task2"],
            },
          }),
      }
    );

    await waitFor(() => {
      expect(queryByText(longTaskName)).toBeNull();
    });
    await waitFor(() => {
      expect(queryByText("task2")).toBeVisible();
    });
  });

  it("should show a tooltip with the full name when hovering over a truncated task name", async () => {
    const { queryByText } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={[longTaskName]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: [longTaskName],
            },
          }),
      }
    );
    fireEvent.mouseEnter(queryByText(trimmedTaskName));
    await waitFor(() => {
      expect(queryByText(longTaskName)).toBeVisible();
    });
  });
});
