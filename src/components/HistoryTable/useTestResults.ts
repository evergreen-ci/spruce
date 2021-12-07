import { useMemo } from "react";
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
  const { getItem, isItemLoaded, historyTableFilters } = useHistoryTable();
  let taskIds: string[] = [];
  const hasTestFilters = historyTableFilters.length > 0;
  if (isItemLoaded(index)) {
    const commit = getItem(index);
    if (commit.type === rowType.COMMIT && commit.commit) {
      taskIds = commit.commit.buildVariants.flatMap((buildVariant) =>
        buildVariant.tasks.map((task) => task.id)
      );
    }
  }
  const hasDataToQuery = taskIds.length > 0;
  const { data, loading } = useQuery<
    GetTaskTestSampleQuery,
    GetTaskTestSampleQueryVariables
  >(GET_TASK_TEST_SAMPLE, {
    variables: {
      tasks: taskIds,
      filters: historyTableFilters,
    },
    fetchPolicy: "no-cache",
    skip: !hasDataToQuery,
  });

  const taskTestMap = useMemo(
    () => new Map<string, TaskTestResultSample>(),
    []
  );
  if (data) {
    const { taskTestSample } = data;
    if (taskTestSample != null) {
      taskTestSample.forEach((taskTest) => {
        taskTestMap.set(taskTest.taskId, taskTest);
      });
    }
  }
  /** getTaskMetadata returns the properties for a task cell given a task id  */
  const getTaskMetadata = useMemo(
    () => (taskId: string) => {
      const taskTest = taskTestMap.get(taskId);
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
    [taskTestMap, hasTestFilters, loading]
  );

  return { getTaskMetadata };
};

export default useTestResults;
