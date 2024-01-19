import { TestFilter } from "gql/generated/types";
import { CommitRowType, mainlineCommits, rowType } from "./types";
import { calcColumnLimitFromWidth, processCommits } from "./utils";

type Action =
  | { type: "ingestNewCommits"; commits: mainlineCommits }
  | { type: "addColumns"; columns: string[] }
  | { type: "nextPageColumns" }
  | { type: "prevPageColumns" }
  | { type: "setColumnLimit"; limit: number }
  | { type: "setHistoryTableFilters"; filters: TestFilter[] }
  | { type: "markSelectedRowVisited" }
  | { type: "onChangeTableWidth"; width: number }
  | { type: "setSelectedCommit"; order: number }
  | {
      type: "toggleRowExpansion";
      rowIndex: number;
      expanded: boolean;
    };

type cacheShape = Map<
  number,
  | mainlineCommits["versions"][0]["version"]
  | mainlineCommits["versions"][0]["rolledUpVersions"][0]
>;
export interface HistoryTableReducerState {
  commitCache: cacheShape;
  currentPage: number;
  columns: string[];
  columnLimit: number;
  commitCount: number;
  loadedCommits: mainlineCommits["versions"];
  pageCount: number;
  processedCommits: CommitRowType[];
  processedCommitCount: number;
  historyTableFilters: TestFilter[];
  selectedCommit: {
    order: number;
    rowIndex: number;
    visited: boolean;
    loaded: boolean;
  };
  visibleColumns: string[];
}

export const reducer = (state: HistoryTableReducerState, action: Action) => {
  switch (action.type) {
    case "addColumns":
      return {
        ...state,
        columns: action.columns,
        visibleColumns: action.columns.slice(0, state.columnLimit),
        currentPage: 0,
        pageCount: Math.ceil(action.columns.length / state.columnLimit),
      };
    case "ingestNewCommits": {
      // We cache the commits and use this to determine if a new commit was added in this action
      // This also performantly handles deduplication of commits at the expense of memory
      const updatedObjectCache = objectifyCommits(
        state.commitCache,
        action.commits.versions,
      );
      if (updatedObjectCache.size > state.commitCache.size) {
        // Check if our selected commit has been loaded
        const { processedCommits, selectedCommitRowIndex } = processCommits({
          newCommits: action.commits.versions,
          existingCommits: state.processedCommits,
          selectedCommitOrder: state.selectedCommit?.order,
        });
        let { commitCount } = state;
        // If there are no previous commits, we can set the commitCount to be the first commit's order.
        if (action.commits.prevPageOrderNumber == null) {
          for (let i = 0; i < action.commits.versions.length; i++) {
            if (action.commits.versions[i].version) {
              // We set the commitCount to double the order number just so we have room for non commit rows (date separators) and (folded commits)
              commitCount = action.commits.versions[i].version.order * 2;
              break;
            }
          }
          // if we have no more commits we have processed everything and know how many commits we have so set the value to that
        } else if (action.commits.nextPageOrderNumber == null) {
          commitCount = processedCommits.length;
        }

        return {
          ...state,
          ...(selectedCommitRowIndex !== null && {
            selectedCommit: {
              ...state.selectedCommit,
              rowIndex: selectedCommitRowIndex,
              loaded: true,
            },
          }),
          commitCache: updatedObjectCache,
          processedCommits,
          processedCommitCount: processedCommits.length,
          commitCount,
        };
      }
      return state;
    }
    case "markSelectedRowVisited":
      return {
        ...state,
        selectedCommit: {
          ...state.selectedCommit,
          visited: true,
        },
      };
    case "nextPageColumns": {
      const pageCount = Math.ceil(state.columns.length / state.columnLimit);
      if (pageCount <= state.currentPage + 1) {
        return state;
      }
      const nextPage = state.currentPage + 1;
      const nextPageColumns = state.columns.slice(
        state.columnLimit * nextPage,
        state.columnLimit * (nextPage + 1),
      );
      return {
        ...state,
        currentPage: state.currentPage + 1,
        visibleColumns: nextPageColumns,
      };
    }
    case "onChangeTableWidth": {
      const nextColumnLimit = calcColumnLimitFromWidth(action.width);
      if (nextColumnLimit === state.columnLimit) {
        return state;
      }
      return {
        ...state,
        visibleColumns: state.columns.slice(0, nextColumnLimit),
        columnLimit: nextColumnLimit,
        currentPage: 0,
        pageCount: Math.ceil(state.columns.length / nextColumnLimit),
      };
    }
    case "prevPageColumns": {
      if (state.currentPage === 0) {
        return state;
      }
      const prevPageColumns = state.columns.slice(
        state.columnLimit * (state.currentPage - 1),
        state.columnLimit * state.currentPage,
      );
      return {
        ...state,
        currentPage: state.currentPage - 1,
        visibleColumns: prevPageColumns,
      };
    }
    case "setColumnLimit":
      return {
        ...state,
        columnLimit: action.limit,
      };
    case "setHistoryTableFilters":
      return {
        ...state,
        historyTableFilters: action.filters,
      };
    case "setSelectedCommit": {
      let rowIndex = null;
      let loaded = false;
      const updatedProcessedCommits = state.processedCommits;
      // If we already loaded the commit we need to search for it in the processed commits
      // to set its selected state to true. This is in the case where we have the commit in the cache.
      const hasMatchingCommit = state.commitCache.has(action.order);
      if (hasMatchingCommit) {
        rowIndex = state.processedCommits.findIndex((commit) =>
          commitOrderToRowIndex(action.order, commit),
        );
        updatedProcessedCommits[rowIndex].selected = true;
        loaded = true;
      }
      return {
        ...state,
        ...(hasMatchingCommit && {
          processedCommits: updatedProcessedCommits,
        }),
        selectedCommit: {
          order: action.order,
          rowIndex,
          visited: false,
          loaded,
        },
      };
    }
    case "toggleRowExpansion": {
      const updatedProcessedCommits = state.processedCommits;
      const row = updatedProcessedCommits[action.rowIndex];
      if (row.type !== rowType.FOLDED_COMMITS) {
        throw new Error(
          `Cannot expand row of type ${
            updatedProcessedCommits[action.rowIndex].type
          }`,
        );
      } else {
        row.expanded = action.expanded;
      }
      return {
        ...state,
        processedCommits: updatedProcessedCommits,
      };
    }

    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

// Objectify commits takes in a cache and a list of commits and returns a new cache with the new commits added
// This is used to performantly track if we have seen a commit before and avoid duplicating it
const objectifyCommits = (
  cache: cacheShape,
  newCommits: mainlineCommits["versions"],
) => {
  const obj = new Map(cache);
  newCommits.forEach((commit) => {
    if (commit.version) {
      obj.set(commit.version.order, commit.version);
    } else if (commit.rolledUpVersions) {
      commit.rolledUpVersions.forEach((version) => {
        obj.set(version.order, version);
      });
    }
  });
  return obj;
};

const commitOrderToRowIndex = (order: number, commit: CommitRowType) => {
  if (commit.type === rowType.COMMIT) {
    return commit.commit.order === order;
  }
  if (commit.type === rowType.FOLDED_COMMITS) {
    return commit.rolledUpCommits.some((elem) => elem.order === order);
  }
  return false;
};
