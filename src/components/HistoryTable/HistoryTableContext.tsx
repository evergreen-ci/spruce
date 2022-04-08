import { useContext, createContext, useReducer, useMemo } from "react";
import {
  MainlineCommitsForHistoryQuery,
  TestFilter,
} from "gql/generated/types";
import { DEFAULT_COLUMN_LIMIT, LOADING_HEIGHT } from "./constants";

import {
  HistoryTableReducerState,
  reducer,
} from "./historyTableContextReducer";
import { mainlineCommits, CommitRowType } from "./types";

interface HistoryTableState {
  columnLimit: number;
  commitCount: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  historyTableFilters: TestFilter[];
  pageCount: number;
  processedCommitCount: number;
  processedCommits: CommitRowType[];
  selectedCommit: {
    order: number;
    rowIndex: number;
  };
  visibleColumns: string[];
  addColumns: (columns: string[]) => void;
  getItem: (index: number) => CommitRowType;
  getItemHeight: (index: number) => number;
  fetchNewCommit: (data: mainlineCommits) => void;
  isItemLoaded: (index: number) => boolean;
  nextPage: () => void;
  onChangeTableWidth: (width: number) => void;
  previousPage: () => void;
  setHistoryTableFilters: (filters: TestFilter[]) => void;
  setSelectedCommit: (order: number) => void;
  toggleRowSizeAtIndex: (index: number, numCommits: number) => void;
}

const HistoryTableDispatchContext = createContext<HistoryTableState | null>(
  null
);

interface HistoryTableProviderProps {
  children: React.ReactNode;
  initialState?: HistoryTableReducerState;
}

const HistoryTableProvider: React.VFC<HistoryTableProviderProps> = ({
  children,
  initialState = {
    columns: [],
    columnLimit: DEFAULT_COLUMN_LIMIT,
    commitCache: new Map(),
    commitCount: 10,
    currentPage: 0,
    historyTableFilters: [],
    loadedCommits: [],
    processedCommits: [],
    processedCommitCount: 0,
    pageCount: 0,
    selectedCommit: null,
    visibleColumns: [],
  },
}) => {
  const [
    {
      commitCount,
      columnLimit,
      currentPage,
      historyTableFilters,
      pageCount,
      processedCommits,
      processedCommitCount,
      selectedCommit,
      visibleColumns,
    },
    dispatch,
  ] = useReducer(reducer, {
    ...initialState,
  });

  const isItemLoaded = (index: number) => processedCommitCount > index;

  const getItem = (index: number) => processedCommits[index];

  const getItemHeight = (index: number) =>
    processedCommits[index]?.rowHeight || LOADING_HEIGHT;

  const historyTableState = useMemo(
    () => ({
      columnLimit,
      commitCount,
      currentPage,
      getItem,
      getItemHeight,
      hasNextPage: currentPage < pageCount - 1,
      hasPreviousPage: currentPage > 0,
      historyTableFilters,
      isItemLoaded,
      pageCount,
      processedCommitCount,
      processedCommits,
      selectedCommit,
      visibleColumns,
      addColumns: (columns: string[]) =>
        dispatch({ type: "addColumns", columns }),
      toggleRowSizeAtIndex: (index: number, numCommits: number) =>
        dispatch({ type: "toggleRowSizeAtIndex", index, numCommits }),
      fetchNewCommit: (
        commits: MainlineCommitsForHistoryQuery["mainlineCommits"]
      ) => dispatch({ type: "ingestNewCommits", commits }),
      nextPage: () => dispatch({ type: "nextPageColumns" }),
      onChangeTableWidth: (width: number): void =>
        dispatch({ type: "onChangeTableWidth", width }),
      previousPage: () => dispatch({ type: "prevPageColumns" }),
      setSelectedCommit: (order: number) =>
        dispatch({ type: "setSelectedCommit", order }),
      setHistoryTableFilters: (filters: TestFilter[]) =>
        dispatch({ type: "setHistoryTableFilters", filters }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleColumns, processedCommitCount, historyTableFilters]
  );
  return (
    <HistoryTableDispatchContext.Provider value={historyTableState}>
      {children}
    </HistoryTableDispatchContext.Provider>
  );
};

const useHistoryTable = () => {
  const context = useContext(HistoryTableDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useHistoryTable must be used within a HistoryTableProvider"
    );
  }
  return context;
};

export { HistoryTableProvider, useHistoryTable };
