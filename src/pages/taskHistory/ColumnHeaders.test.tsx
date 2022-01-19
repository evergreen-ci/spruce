import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { context } from "components/HistoryTable";
import { HistoryTableReducerState } from "components/HistoryTable/historyTableContextReducer";
import {
  fireEvent,
  renderWithRouterMatch as render,
  waitFor,
} from "test_utils";
import { string } from "utils";
import ColumnHeaders from "./ColumnHeaders";

const { trimMiddleText } = string;
const { HistoryTableProvider } = context;
const longVariantName = "really_really_really_really_really_long_variant_name";
const trimmedVariantName = trimMiddleText(longVariantName, 50, 15);

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

interface wrapperProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
  state?: Partial<HistoryTableReducerState>;
}

const wrapper: React.FC<wrapperProps> = ({ children, mocks = [], state }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

describe("columnHeaders (Task History)", () => {
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
          columns={[
            { displayName: "variant1", buildVariant: "variant1" },
            { displayName: "variant2", buildVariant: "variant2" },
            { displayName: "variant3", buildVariant: "variant3" },
          ]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: ["variant1", "variant2", "variant3"],
            },
          }),
      }
    );
    expect(queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    expect(queryAllByDataCy("header-cell")).toHaveLength(3);
  });

  it("should link to corresponding /variant-history/:projectId/:variantName page", async () => {
    const { queryByRole } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={[{ displayName: "variant1", buildVariant: "variant1" }]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: ["variant1"],
            },
          }),
      }
    );
    expect(queryByRole("link")).toHaveAttribute(
      "href",
      "/variant-history/evergreen/variant1"
    );
  });

  it("should truncate the variant name when only if it is too long", async () => {
    const { queryByText } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={[
            {
              displayName: longVariantName,
              buildVariant: longVariantName,
            },
            { displayName: "variant2", buildVariant: "variant2" },
          ]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: [longVariantName, "variant2"],
            },
          }),
      }
    );

    await waitFor(() => {
      expect(queryByText(longVariantName)).toBeNull();
    });
    await waitFor(() => {
      expect(queryByText("variant2")).toBeVisible();
    });
  });

  it("should show a tooltip with the full name when hovering over a truncated variant name", async () => {
    const { queryByText } = render(
      () => (
        <ColumnHeaders
          loading={false}
          projectId="evergreen"
          columns={[
            {
              displayName: longVariantName,
              buildVariant: longVariantName,
            },
          ]}
        />
      ),
      {
        wrapper: ({ children }) =>
          wrapper({
            children,
            state: {
              visibleColumns: [longVariantName],
            },
          }),
      }
    );
    fireEvent.mouseEnter(queryByText(trimmedVariantName));
    await waitFor(() => {
      expect(queryByText(longVariantName)).toBeVisible();
    });
  });
});
