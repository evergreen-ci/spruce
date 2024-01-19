import { useState, useEffect, useCallback, useRef } from "react";

import TaskHistoryRow from "pages/taskHistory/TaskHistoryRow";
import VariantHistoryRow from "pages/variantHistory/VariantHistoryRow";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { context } from ".";
import HistoryTable from "./HistoryTable";
import { mainlineCommitData } from "./testData";

const { HistoryTableProvider, useHistoryTable } = context;

export default {
  component: HistoryTable,
} satisfies CustomMeta<typeof HistoryTable>;

export const TaskHistoryTable: CustomStoryObj<typeof HistoryTable> = {
  render: () => (
    <HistoryTableProvider>
      <HistoryTableWrapper type="task" />
    </HistoryTableProvider>
  ),
};

export const VariantHistoryTable: CustomStoryObj<typeof HistoryTable> = {
  render: () => (
    <HistoryTableProvider>
      <HistoryTableWrapper type="variant" />
    </HistoryTableProvider>
  ),
};

interface HistoryTableWrapperProps {
  type?: "variant" | "task";
}
const HistoryTableWrapper: React.FC<HistoryTableWrapperProps> = ({ type }) => {
  const { addColumns, ingestNewCommits } = useHistoryTable();
  const [isLoading, setIsLoading] = useState(false);
  const [oldData, setOldData] = useState(mainlineCommitData);
  const timeoutRef = useRef(null);
  useEffect(() => {
    const taskColumns = ["ubuntu1604", "race-detector", "lint"];
    const variantColumns = ["Lint", "test-model-distro", "dist"];
    addColumns(type === "task" ? taskColumns : variantColumns);
    ingestNewCommits(mainlineCommitData);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    setIsLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      const newData = generateNewCommitData(oldData);
      ingestNewCommits(newData);
      setOldData(newData);
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldData]);

  return (
    <div style={{ height: 600, width: "100%", border: "red 1px solid" }}>
      <HistoryTable loadMoreItems={loadMore} loading={isLoading}>
        {type === "task" ? TaskHistoryRow : VariantHistoryRow}
      </HistoryTable>
    </div>
  );
};

// This is a helper function to generate new commit data
const generateNewCommitData = (oldData: typeof mainlineCommitData) => {
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
        },
      );
    }
    return newVersion;
  });

  return {
    ...commitData,
    versions: updatedVersions,
  };
};
