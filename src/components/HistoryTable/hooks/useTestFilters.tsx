import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TestStatus } from "types/history";
import { queryString, array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";

const { parseQueryString } = queryString;
const { toArray } = array;

const useTestFilters = () => {
  const { search } = useLocation();
  const { setHistoryTableFilters } = useHistoryTable();
  useEffect(() => {
    const queryParams = parseQueryString(search);
    const failingTests = toArray(queryParams[TestStatus.Failed]);
    const passingTests = toArray(queryParams[TestStatus.Passed]);
    const failingTestFilters = failingTests.map((test) => ({
      testName: test,
      testStatus: TestStatus.Failed,
    }));
    const passingTestFilters = passingTests.map((test) => ({
      testName: test,
      testStatus: TestStatus.Passed,
    }));
    setHistoryTableFilters([...failingTestFilters, ...passingTestFilters]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
};

export default useTestFilters;
