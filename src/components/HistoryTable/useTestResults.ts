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

  if (isItemLoaded(index)) {
    const commit = getItem(index);
    if (commit.type === rowType.COMMIT && commit.commit) {
      taskIds = commit.commit.buildVariants.flatMap((buildVariant) =>
        buildVariant.tasks.map((task) => task.id)
      );
    }
  }
  const hasDataToQuery = taskIds.length > 0;
  const { data } = useQuery<
    GetTaskTestSampleQuery,
    GetTaskTestSampleQueryVariables
  >(GET_TASK_TEST_SAMPLE, {
    variables: {
      tasks: taskIds,
      filters: historyTableFilters,
    },
    skip: !hasDataToQuery,
  });
  const taskTestMap = new Map<string, TaskTestResultSample>();
  if (data) {
    const { taskTestSample } = data;
    if (taskTestSample != null) {
      taskTestSample.forEach((taskTest) => {
        taskTestMap.set(taskTest.taskId, taskTest);
      });
    }
  }

  /** getTaskMetadata returns the properties for a task cell  */
  const getTaskMetadata = (taskId: string) => {
    const taskTest = taskTestMap.get(taskId);
    // If we haven't fetched task test results return an empty value
    if (!hasDataToQuery) {
      return {
        inactive: false,
        label: "",
        failingTests: [],
      };
    }
    if (taskTest) {
      const matchingTestNameCount = taskTest.matchingFailedTestNames.length;
      // if the user does not have any test filters applied return just the test results with no label
      if (historyTableFilters.length === 0) {
        return {
          inactive: false,
          label: "",
          failingTests: taskTest.matchingFailedTestNames,
        };
      }
      // if the user has test filters applied and the task has failed tests return the label with the number of failed tests
      return {
        inactive: matchingTestNameCount === 0,
        label: `${matchingTestNameCount} / ${taskTest.totalTestCount} Failing Tests`,
        failingTests: taskTest.matchingFailedTestNames,
      };
    }
    return {
      inactive: true,
      label: "",
      failingTests: [],
    };
  };
  return { getTaskMetadata };
};

export default useTestResults;
