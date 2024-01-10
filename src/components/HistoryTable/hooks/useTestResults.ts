import { useCallback, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
  TaskTestResultSample,
} from "gql/generated/types";
import { TASK_TEST_SAMPLE } from "gql/queries";
import { array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";
import { rowType } from "../types";

const { convertArrayToObject } = array;

/**
 * useTestResults is a hook that given an index checks if a commit has been loaded and has test filters applied and then fetches the test results for the given tasks
 * @param rowIndex - the index of the row in the history table
 * @returns getTaskMetadata - a function that given a task id returns the test results for that task
 */
const useTestResults = (rowIndex: number) => {
  const { getItem, historyTableFilters } = useHistoryTable();
  let taskIds: string[] = [];
  const hasTestFilters = historyTableFilters.length > 0;
  const [taskTestMap, setTaskTestMap] = useState<{
    [taskId: string]: TaskTestResultSample;
  }>({});

  const commit = getItem(rowIndex);
  if (commit && commit.type === rowType.COMMIT && commit.commit) {
    taskIds = commit.commit.buildVariants.flatMap((buildVariant) =>
      buildVariant.tasks.map((task) => task.id),
    );
  }
  const hasDataToQuery = taskIds.length > 0;
  const { loading } = useQuery<
    TaskTestSampleQuery,
    TaskTestSampleQueryVariables
  >(TASK_TEST_SAMPLE, {
    variables: {
      tasks: taskIds,
      filters: historyTableFilters,
    },
    skip: !hasDataToQuery,
    onCompleted: (data) => {
      const { taskTestSample } = data;
      if (taskTestSample != null) {
        const ttm = convertArrayToObject(taskTestSample, "taskId");
        setTaskTestMap(ttm);
      }
    },
  });

  /** getTaskMetadata returns the properties for a task cell given a task id  */
  const getTaskMetadata = useCallback(
    (taskId: string) => {
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
    [hasTestFilters, loading, taskTestMap],
  );

  return { getTaskMetadata };
};

export default useTestResults;
