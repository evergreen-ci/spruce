import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { HistoryTableProvider } from "../HistoryTableContext";
import { HistoryTableReducerState } from "../historyTableContextReducer";

const initialState: HistoryTableReducerState = {
  columnLimit: 7,
  columns: [],
  commitCache: new Map(),
  commitCount: 10,
  currentPage: 0,
  historyTableFilters: [],
  loadedCommits: [],
  pageCount: 0,
  processedCommitCount: 0,
  processedCommits: [],
  selectedCommit: null,
  visibleColumns: [],
};

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  state?: Partial<HistoryTableReducerState>;
  children: React.ReactNode;
}
const ProviderWrapper: React.VFC<ProviderProps> = ({
  children,
  mocks = [],
  state = {},
}) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider initialState={{ ...initialState, ...state }}>
      {children}
    </HistoryTableProvider>
  </MockedProvider>
);

export { ProviderWrapper };
