import { useContext, createContext, useEffect, useState } from "react";
import { MainlineCommitsForHistoryQuery } from "gql/generated/types";

enum rowType {
  FOLDED_COMMITS,
  DATE_SEPERATOR,
  COMMIT,
}

type mainlineCommits = MainlineCommitsForHistoryQuery["mainlineCommits"];
interface HistoryTableState {
  loadedCommits: {
    [key: number]: mainlineCommits["versions"];
  };
  itemHeight: (index: number) => number;
  fetchNewCommit: (data: mainlineCommits) => void;
  isItemLoaded: (index: number) => boolean;
  getItem: (index: number) => mainlineCommits["versions"][0];
}

const HistoryTableDispatchContext = createContext<any | null>(null);

const HistoryTableProvider: React.FC = ({ children }) => {
  const [
    recentlyFetchedCommits,
    setRecentlyFetchedCommits,
  ] = useState<mainlineCommits>(null);
  const [loadedCommits, setLoadedCommits] = useState([]);
  const [, setLoadedItemSizes] = useState([]);
  useEffect(() => {
    if (recentlyFetchedCommits) {
      setLoadedCommits((curr) => [...curr, ...recentlyFetchedCommits.versions]);
      setLoadedItemSizes(processCommits(recentlyFetchedCommits));
    }
  }, [recentlyFetchedCommits]);

  const itemHeight = () => 120;
  const isItemLoaded = (index) => loadedCommits.length > index;

  const getItem = (index: number) => loadedCommits[index];

  const historyTableState: HistoryTableState = {
    loadedCommits,
    itemHeight,
    fetchNewCommit: setRecentlyFetchedCommits,
    isItemLoaded,
    getItem,
  };
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

const processCommits = (
  commits: MainlineCommitsForHistoryQuery["mainlineCommits"]
) => {
  const { versions } = commits;
  const results = [];
  for (let i = 0; i < versions.length; i++) {
    const commit = versions[i];
    if (commit.version) {
      results.push(rowType.COMMIT);
    }
    if (commit.rolledUpVersions) {
      results.push(rowType.FOLDED_COMMITS);
    }
  }
  return results;
};
export { HistoryTableProvider, useHistoryTable };
