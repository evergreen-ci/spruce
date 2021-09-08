import { useContext, createContext, useReducer, useMemo } from "react";
import { reducer } from "./historyTableContextReducer";
import { rowType, mainlineCommits, CommitRowType } from "./utils";

interface HistoryTableState {
  itemHeight: (index: number) => number;
  fetchNewCommit: (data: mainlineCommits) => void;
  isItemLoaded: (index: number) => boolean;
  getItem: (index: number) => CommitRowType;
  processedCommitCount: number;
  processedCommits: CommitRowType[];
  visibleColumns: string[];
  addColumns: (columns: string[]) => void;
  nextPage: () => void;
  previousPage: () => void;
}

const HistoryTableDispatchContext = createContext<any | null>(null);

const HistoryTableProvider: React.FC = ({ children }) => {
  const [
    { processedCommits, processedCommitCount, visibleColumns },
    dispatch,
  ] = useReducer(reducer, {
    loadedCommits: [],
    processedCommits: [],
    processedCommitCount: 0,
    commitCache: {},
    cacheSize: 0,
    visibleColumns: [],
    currentPage: 0,
    columns: [],
    columnLimit: 8,
  });

  const itemHeight = (index) => {
    // TODO: Fix bug causing itemHeight to be 0 on intial render
    // There is a race condition where it tries to calculate element heights before the element content is loaded in
    if (processedCommits[index]) {
      switch (processedCommits[index].type) {
        case rowType.COMMIT:
          return 120;
        case rowType.DATE_SEPERATOR:
          return 40;
        case rowType.FOLDED_COMMITS:
          return 40;
        default:
          return 100;
      }
    } else {
      return 120;
    }
  };
  const isItemLoaded = (index) => processedCommitCount > index;

  const getItem = (index: number) => processedCommits[index];

  const historyTableState: HistoryTableState = useMemo(
    () => ({
      itemHeight,
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processedCommits, visibleColumns, processedCommitCount]
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
