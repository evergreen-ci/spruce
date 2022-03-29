import { useContext, createContext, useReducer, useMemo } from "react";
import { TestFilter } from "gql/generated/types";
import { COMMIT_HEIGHT, DEFAULT_COLUMN_LIMIT } from "./constants";
import {
  HistoryTableReducerState,
  reducer,
} from "./historyTableContextReducer";
import { mainlineCommits, CommitRowType } from "./types";

interface HistoryTableState {
  getItemHeight: (index: number) => number;
  toggleRowSizeAtIndex: (index: number, numCommits: number) => void;
  fetchNewCommit: (data: mainlineCommits) => void;
  isItemLoaded: (index: number) => boolean;
  getItem: (index: number) => CommitRowType;
  processedCommitCount: number;
  processedCommits: CommitRowType[];
  visibleColumns: string[];
  addColumns: (columns: string[]) => void;
  nextPage: () => void;
  previousPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageCount: number;
  currentPage: number;
  columnLimit: number;
  historyTableFilters: TestFilter[];
  setHistoryTableFilters: (filters: TestFilter[]) => void;
  onChangeTableWidth: (width: number) => void;
  commitCount: number;
}

const HistoryTableDispatchContext = createContext<any | null>(null);

interface HistoryTableProviderProps {
  children: React.ReactNode;
  initialState?: HistoryTableReducerState;
}

const HistoryTableProvider: React.FC<HistoryTableProviderProps> = ({
  children,
  initialState = {
    loadedCommits: [],
    processedCommits: [],
    processedCommitCount: 0,
    commitCache: new Map(),
    visibleColumns: [],
    currentPage: 0,
    pageCount: 0,
    columns: [],
    columnLimit: DEFAULT_COLUMN_LIMIT,
    historyTableFilters: [],
    commitCount: 10,
  },
}) => {
  const [
    {
      processedCommits,
      processedCommitCount,
      visibleColumns,
      pageCount,
      currentPage,
      columnLimit,
      historyTableFilters,
      commitCount,
    },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
  });

  const isItemLoaded = (index: number) => processedCommitCount > index;

  const getItem = (index: number) => processedCommits[index];

  const getItemHeight = (index: number) =>
    processedCommits[index]?.rowHeight || COMMIT_HEIGHT;

  const historyTableState: HistoryTableState = useMemo(
    () => ({
      getItemHeight,
      toggleRowSizeAtIndex: (index: number, numCommits: number) =>
        dispatch({ type: "toggleRowSizeAtIndex", index, numCommits }),
      fetchNewCommit: (commits) =>
        dispatch({ type: "ingestNewCommits", commits }),
      isItemLoaded,
      getItem,
      processedCommitCount,
      processedCommits,
      visibleColumns,
      addColumns: (columns) => dispatch({ type: "addColumns", columns }),
      nextPage: () => dispatch({ type: "nextPageColumns" }),
      previousPage: () => dispatch({ type: "prevPageColumns" }),
      hasNextPage: currentPage < pageCount - 1,
      hasPreviousPage: currentPage > 0,
      currentPage,
      pageCount,
      columnLimit,
      historyTableFilters,
      onChangeTableWidth: (width: number): void =>
        dispatch({ type: "onChangeTableWidth", width }),
      setHistoryTableFilters: (filters) =>
        dispatch({ type: "setHistoryTableFilters", filters }),
      commitCount,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      processedCommits,
      visibleColumns,
      processedCommitCount,
      historyTableFilters,
    ]
  );
  return (
    <HistoryTableDispatchContext.Provider value={historyTableState}>
      {children}
    </HistoryTableDispatchContext.Provider>
  );
};

const useHistoryTable = (): HistoryTableState => {
  const context = useContext(HistoryTableDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useHistoryTable must be used within a HistoryTableProvider"
    );
  }
  return context;
};

export { HistoryTableProvider, useHistoryTable };
