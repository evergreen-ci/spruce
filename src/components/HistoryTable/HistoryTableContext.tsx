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
  null,
);
interface HistoryTableProviderProps {
  children: React.ReactNode;
  initialState?: HistoryTableReducerState;
}

const HistoryTableProvider: React.FC<HistoryTableProviderProps> = ({
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
      columnLimit,
      commitCount,
      currentPage,
      getItem,
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
      ingestNewCommits: (
        commits: MainlineCommitsForHistoryQuery["mainlineCommits"],
      ) => dispatch({ type: "ingestNewCommits", commits }),
      markSelectedRowVisited: () =>
        dispatch({ type: "markSelectedRowVisited" }),
      nextPage: () => dispatch({ type: "nextPageColumns" }),
      onChangeTableWidth,
      previousPage: () => dispatch({ type: "prevPageColumns" }),
      setSelectedCommit: (order: number) =>
        dispatch({ type: "setSelectedCommit", order }),
      setHistoryTableFilters: (filters: TestFilter[]) =>
        dispatch({ type: "setHistoryTableFilters", filters }),
      toggleRowExpansion: (rowIndex: number, expanded: boolean) => {
        dispatch({
          type: "toggleRowExpansion",
          rowIndex,
          expanded,
        });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleColumns, processedCommitCount, historyTableFilters],
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
      "useHistoryTable must be used within a HistoryTableProvider",
    );
  }
  return context;
};

export { HistoryTableProvider, useHistoryTable };
