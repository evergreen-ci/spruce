import { useState, useEffect } from "react";
import HistoryTable from ".";
import { HistoryTableProvider, useHistoryTable } from "./HistoryTableContext";
import { mainlineCommitData } from "./testData";

export * from "./HistoryTableIcon/HistoryTableIcon.stories";

export default {
  title: "History Table",
};

export const Default = () => (
  <HistoryTableProvider>
    <HistoryTableWrapper />
  </HistoryTableProvider>
);

const HistoryTableWrapper = () => {
  const { addColumns } = useHistoryTable();
  const [commitData, setCommitData] = useState(mainlineCommitData);
  useEffect(() => {
    addColumns(["ubuntu1604", "race-detector", "lint"]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const loadMore = () => {
    setCommitData(fetchNewCommitData(commitData));
  };

  return (
    <div style={{ height: 800, width: "100%" }}>
      <HistoryTable
        recentlyFetchedCommits={commitData}
        loadMoreItems={loadMore}
      />
    </div>
  );
};

// This is a helper function to generate new commit data
const fetchNewCommitData = (oldData: typeof mainlineCommitData) => {
  const commitData = { ...oldData };
  // get last 5 versions from commit data
  const last5Versions = commitData.versions.slice(-5);
  let counter = 1;
  const updatedVersions = last5Versions.map((version) => {
    const newVersion = { ...version };
    if (newVersion.version) {
      // version order number is a random number
      const dt = new Date(newVersion.version.createTime);
      dt.setDate(dt.getDate() - 1);
      newVersion.version.createTime = dt.toISOString();
      newVersion.version.order -= counter;
      counter += 1;
    } else {
      newVersion.rolledUpVersions = newVersion.rolledUpVersions.map(
        (rolledUpVersion) => {
          const newRolledUpVersion = { ...rolledUpVersion };
          const dt = new Date(newRolledUpVersion.createTime);
          dt.setDate(dt.getDate() - 1);
          newRolledUpVersion.createTime = dt.toISOString();
          newRolledUpVersion.order -= counter;
          counter += 1;
          return newRolledUpVersion;
        }
      );
    }
    return newVersion;
  });
  return {
    ...commitData,
    versions: updatedVersions,
  };
};
