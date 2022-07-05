import { useState, useEffect } from "react";
import TaskHistoryRow from "pages/taskHistory/TaskHistoryRow";
import VariantHistoryRow from "pages/variantHistory/VariantHistoryRow";
import HistoryTable, { context } from ".";
import { mainlineCommitData } from "./testData";

const { HistoryTableProvider, useHistoryTable } = context;

export default {
  title: "Components/History Table",
  component: HistoryTable,
};

export const TaskHistoryTable = () => (
  <HistoryTableProvider>
    <HistoryTableWrapper type="task" />
  </HistoryTableProvider>
);

export const VariantHistoryTable = () => (
  <HistoryTableProvider>
    <HistoryTableWrapper type="variant" />
  </HistoryTableProvider>
);

interface HistoryTableWrapperProps {
  type?: "variant" | "task";
}
const HistoryTableWrapper: React.VFC<HistoryTableWrapperProps> = ({ type }) => {
  const { addColumns } = useHistoryTable();
  const [commitData, setCommitData] = useState(mainlineCommitData);
  useEffect(() => {
    const taskColumns = ["ubuntu1604", "race-detector", "lint"];
    const variantColumns = ["Lint", "test-model-distro", "dist"];
    addColumns(type === "task" ? taskColumns : variantColumns);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    setCommitData(ingestNewCommitData(commitData));
  };

  return (
    <div style={{ height: 800, width: "100%" }}>
      <HistoryTable
        recentlyFetchedCommits={commitData}
        loadMoreItems={loadMore}
      >
        {type === "task" ? TaskHistoryRow : VariantHistoryRow}
      </HistoryTable>
    </div>
  );
};

// This is a helper function to generate new commit data
const ingestNewCommitData = (oldData: typeof mainlineCommitData) => {
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
