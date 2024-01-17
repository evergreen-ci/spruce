import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HistoryQueryParams } from "types/history";
import { queryString } from "utils";
import { useHistoryTable } from "../HistoryTableContext";

const { getString, parseQueryString } = queryString;

const useJumpToCommit = () => {
  const { search } = useLocation();
  const { [HistoryQueryParams.SelectedCommit]: skipOrderNumberParam } = useMemo(
    () => parseQueryString(search),
    [search],
  );
  const skipOrderNumber =
    parseInt(getString(skipOrderNumberParam), 10) || undefined;

  const { setSelectedCommit } = useHistoryTable();
  useEffect(() => {
    if (skipOrderNumber) {
      setSelectedCommit(skipOrderNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipOrderNumber]);
};

export default useJumpToCommit;
