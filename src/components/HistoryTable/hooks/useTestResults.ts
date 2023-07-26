import { useCallback, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
  TaskTestResultSample,
} from "gql/generated/types";
import { GET_TASK_TEST_SAMPLE } from "gql/queries";
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
      buildVariant.tasks.map((task) => task.id)
    );
  }
  const hasDataToQuery = taskIds.length > 0;
  const { loading } = useQuery<
    TaskTestSampleQuery,
    TaskTestSampleQueryVariables
  >(GET_TASK_TEST_SAMPLE, {
    onCompleted: (data) => {
      const { taskTestSample } = data;
      if (taskTestSample != null) {
        const ttm = convertArrayToObject(taskTestSample, "taskId");
        setTaskTestMap(ttm);
      }
    },
    skip: !hasDataToQuery,
    variables: {
      filters: historyTableFilters,
      tasks: taskIds,
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
          failingTests: taskTest.matchingFailedTestNames,
          inactive: hasTestFilters && matchingTestNameCount === 0,
          label: hasTestFilters ? label : "",
          loading,
        };
      }
      return {
        failingTests: [],
        inactive: hasTestFilters,
        label: "",
        loading,
      };
    },
    [hasTestFilters, loading, taskTestMap]
  );

  return { getTaskMetadata };
};

export default useTestResults;
