import {
  useContext,
  createContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";
import {
  MainlineCommitsForHistoryQuery,
  TestFilter,
} from "gql/generated/types";
import { DEFAULT_COLUMN_LIMIT } from "./constants";

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
    visited: boolean;
    loaded: boolean;
  };
  visibleColumns: string[];
  addColumns: (columns: string[]) => void;
  getItem: (index: number) => CommitRowType;
  ingestNewCommits: (data: mainlineCommits) => void;
  isItemLoaded: (index: number) => boolean;
  markSelectedRowVisited: () => void;
  nextPage: () => void;
  onChangeTableWidth: (width: number) => void;
  previousPage: () => void;
  setHistoryTableFilters: (filters: TestFilter[]) => void;
  setSelectedCommit: (order: number) => void;
  toggleRowExpansion: (rowIndex: number, expanded: boolean) => void;
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
    columnLimit: DEFAULT_COLUMN_LIMIT,
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
  },
}) => {
  const [
    {
      columnLimit,
      commitCount,
      currentPage,
      historyTableFilters,
      pageCount,
      processedCommitCount,
      processedCommits,
      selectedCommit,
      visibleColumns,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const isItemLoaded = (index: number) => processedCommitCount > index;

  const getItem = (index: number) => processedCommits[index];

  const onChangeTableWidth = useCallback((width: number) => {
    dispatch({ type: "onChangeTableWidth", width });
  }, []);
  const historyTableState = useMemo(
    () => ({
      addColumns: (columns: string[]) =>
        dispatch({ columns, type: "addColumns" }),
      columnLimit,
      commitCount,
      currentPage,
      getItem,
      hasNextPage: currentPage < pageCount - 1,
      hasPreviousPage: currentPage > 0,
      historyTableFilters,
      ingestNewCommits: (
        commits: MainlineCommitsForHistoryQuery["mainlineCommits"]
      ) => dispatch({ commits, type: "ingestNewCommits" }),
      isItemLoaded,
      markSelectedRowVisited: () =>
        dispatch({ type: "markSelectedRowVisited" }),
      nextPage: () => dispatch({ type: "nextPageColumns" }),
      onChangeTableWidth,
      pageCount,
      previousPage: () => dispatch({ type: "prevPageColumns" }),
      processedCommitCount,
      processedCommits,
      selectedCommit,
      setHistoryTableFilters: (filters: TestFilter[]) =>
        dispatch({ filters, type: "setHistoryTableFilters" }),
      setSelectedCommit: (order: number) =>
        dispatch({ order, type: "setSelectedCommit" }),
      toggleRowExpansion: (rowIndex: number, expanded: boolean) => {
        dispatch({
          expanded,
          rowIndex,
          type: "toggleRowExpansion",
        });
      },
      visibleColumns,
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
