import { processCommits, CommitRowType, mainlineCommits } from "./utils";

type Action =
  | { type: "ingestNewCommits"; commits: mainlineCommits }
  | { type: "addColumns"; columns: string[] }
  | { type: "nextPageColumns" }
  | { type: "prevPageColumns" }
  | { type: "setColumnLimit"; limit: number };

type cacheShape = {
  [order: number]:
    | mainlineCommits["versions"][0]["version"]
    | mainlineCommits["versions"][0]["rolledUpVersions"][0];
};
interface HistoryTableState {
  loadedCommits: mainlineCommits["versions"];
  processedCommits: CommitRowType[];
  processedCommitCount: number;
  commitCache: cacheShape;
  cacheSize: number;
  visibleColumns: string[];
  currentPage: number;
  columns: string[];
  columnLimit: number;
}

export const reducer = (state: HistoryTableState, action: Action) => {
  switch (action.type) {
    case "ingestNewCommits": {
      // We cache the commits and use this to determine if a new commit was added in this action
      //   This also performantly handles deduplication of commits at the expense of memory
      const updatedObjectCache = objectifyCommits(
        state.commitCache,
        action.commits.versions
      );
      const updatedCache = Object.values(updatedObjectCache);
      if (updatedCache.length > state.cacheSize) {
        const processedCommits = processCommits(
          action.commits.versions,
          state.processedCommits
        );
        return {
          ...state,
          commitCache: updatedObjectCache,
          cacheSize: updatedCache.length,
          processedCommits,
          processedCommitCount: processedCommits.length,
        };
      }
      return state;
    }
    case "addColumns":
      return {
        ...state,
        columns: action.columns,
        visibleColumns: action.columns.slice(0, 8),
        currentPage: 0,
      };
    case "nextPageColumns": {
      const pageCount = Math.ceil(state.columns.length / 8);
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
  const obj = { ...cache };
  newCommits.forEach((commit) => {
    if (commit.version) {
      obj[commit.version.order] = commit.version;
    } else if (commit.rolledUpVersions) {
      commit.rolledUpVersions.forEach((version) => {
        obj[version.order] = version;
      });
    }
  });
  return obj;
};
