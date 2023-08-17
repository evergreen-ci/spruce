import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { HistoryTableProvider } from "../HistoryTableContext";
import { HistoryTableReducerState } from "../historyTableContextReducer";

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

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  state?: Partial<HistoryTableReducerState>;
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({
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
