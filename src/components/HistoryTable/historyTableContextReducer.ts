import { TestFilter } from "gql/generated/types";
import { CommitRowType, mainlineCommits } from "./types";
import { processCommits, toggleRowSizeAtIndex } from "./utils";

type Action =
  | { type: "ingestNewCommits"; commits: mainlineCommits }
  | { type: "addColumns"; columns: string[] }
  | { type: "nextPageColumns" }
  | { type: "prevPageColumns" }
  | { type: "setColumnLimit"; limit: number }
  | { type: "setHistoryTableFilters"; filters: TestFilter[] }
  | { type: "toggleRowSizeAtIndex"; index: number; numCommits: number };

type cacheShape = Map<
  number,
  | mainlineCommits["versions"][0]["version"]
  | mainlineCommits["versions"][0]["rolledUpVersions"][0]
>;
export interface HistoryTableReducerState {
  loadedCommits: mainlineCommits["versions"];
  processedCommits: CommitRowType[];
  processedCommitCount: number;
  commitCache: cacheShape;
  visibleColumns: string[];
  currentPage: number;
  pageCount: number;
  columns: string[];
  columnLimit: number;
  historyTableFilters: TestFilter[];
  commitCount: number;
}

export const reducer = (state: HistoryTableReducerState, action: Action) => {
  switch (action.type) {
    case "ingestNewCommits": {
      // We cache the commits and use this to determine if a new commit was added in this action
      // This also performantly handles deduplication of commits at the expense of memory
      const updatedObjectCache = objectifyCommits(
        state.commitCache,
        action.commits.versions
      );
      if (updatedObjectCache.size > state.commitCache.size) {
        const processedCommits = processCommits(
          action.commits.versions,
          state.processedCommits
        );

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
          commitCache: updatedObjectCache,
          processedCommits,
          processedCommitCount: processedCommits.length,
          commitCount,
        };
      }
      return state;
    }
    case "toggleRowSizeAtIndex": {
      const newProcessedCommits = toggleRowSizeAtIndex(
        state.processedCommits,
        action.numCommits,
        action.index
      );
      return {
        ...state,
        processedCommits: newProcessedCommits,
      };
    }
    case "addColumns":
      return {
        ...state,
        columns: action.columns,
        visibleColumns: action.columns.slice(0, state.columnLimit),
        currentPage: 0,
        pageCount: Math.ceil(action.columns.length / state.columnLimit),
      };
    case "nextPageColumns": {
      const pageCount = Math.ceil(state.columns.length / state.columnLimit);
      if (pageCount <= state.currentPage + 1) {
        return state;
      }
      const nextPage = state.currentPage + 1;
      const nextPageColumns = state.columns.slice(
        state.columnLimit * nextPage,
        state.columnLimit * (nextPage + 1)
      );
      return {
        ...state,
        currentPage: state.currentPage + 1,
        visibleColumns: nextPageColumns,
      };
    }
    case "prevPageColumns": {
      if (state.currentPage === 0) {
        return state;
      }
      const prevPageColumns = state.columns.slice(
        state.columnLimit * (state.currentPage - 1),
        state.columnLimit * state.currentPage
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
    default:
      throw new Error(`Unknown reducer action${action}`);
  }
};

// Objectify commits takes in a cache and a list of commits and returns a new cache with the new commits added
// This is used to performantly track if we have seen a commit before and avoid duplicating it
const objectifyCommits = (
  cache: cacheShape,
  newCommits: mainlineCommits["versions"]
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
