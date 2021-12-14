import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GetTaskTestSampleQuery,
  GetTaskTestSampleQueryVariables,
  TaskTestResultSample,
} from "gql/generated/types";
import { GET_TASK_TEST_SAMPLE } from "gql/queries";
import { useHistoryTable } from "./HistoryTableContext";
import { rowType } from "./types";

/** useTestResults is a hook that given an index checks if a commit has been loaded and has test filters applied and then  */
const useTestResults = (index: number) => {
  const { getItem, historyTableFilters } = useHistoryTable();
  let taskIds: string[] = [];
  const hasTestFilters = historyTableFilters.length > 0;
  const [taskTestMap, setTaskTestMap] = useState<{
    [taskId: string]: TaskTestResultSample;
  }>({});

  const commit = getItem(index);
  if (commit && commit.type === rowType.COMMIT && commit.commit) {
    taskIds = commit.commit.buildVariants.flatMap((buildVariant) =>
      buildVariant.tasks.map((task) => task.id)
    );
  }
  const hasDataToQuery = taskIds.length > 0;
  const { loading } = useQuery<
    GetTaskTestSampleQuery,
    GetTaskTestSampleQueryVariables
  >(GET_TASK_TEST_SAMPLE, {
    variables: {
      tasks: taskIds,
      filters: historyTableFilters,
    },
    skip: !hasDataToQuery,
    onCompleted: (data) => {
      const { taskTestSample } = data;
      if (taskTestSample != null) {
        const ttm = taskTestSample.reduce((acc, taskTest) => {
          const { taskId } = taskTest;
          acc[taskId] = taskTest;
          return acc;
        }, {});
        setTaskTestMap(ttm);
      }
    },
  });

  /** getTaskMetadata returns the properties for a task cell given a task id  */
  const getTaskMetadata = useMemo(
    () => (taskId: string) => {
      const taskTest = taskTestMap[taskId];
      if (taskTest) {
        const matchingTestNameCount =
          taskTest.matchingFailedTestNames?.length || 0;
        const label = `${matchingTestNameCount} / ${taskTest.totalTestCount} Failing Tests`;
        return {
          label: hasTestFilters ? label : "",
          inactive: hasTestFilters && matchingTestNameCount === 0,
          loading,
          failingTests: taskTest.matchingFailedTestNames,
        };
      }
      return {
        label: "",
        inactive: hasTestFilters,
        loading,
        failingTests: [],
      };
    },
    [hasTestFilters, loading, taskTestMap]
  );

  return { getTaskMetadata };
};

export default useTestResults;
