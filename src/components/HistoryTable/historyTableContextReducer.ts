import { processCommits, CommitRowType, mainlineCommits } from "./utils";

type Action = { type: "ingestNewCommits"; commits: mainlineCommits };

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
      return {
        ...state,
      };
    }

    default:
      throw new Error(`Unknown reducer action${action.type}`);
  }
};

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
