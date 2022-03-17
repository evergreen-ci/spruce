import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HistoryQueryParams } from "types/history";
import { queryString, array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";

const { parseQueryString } = queryString;
const { toArray } = array;

const useColumns = <T>(allColumns: T[], accessFunc: (column: T) => string) => {
  const { search } = useLocation();
  const queryParams = useMemo(() => parseQueryString(search), [search]);
  const { addColumns } = useHistoryTable();

  const selectedColumnsInQuery = useMemo(
    () => toArray(queryParams[HistoryQueryParams.VisibleColumns]),
    [queryParams]
  );

  const activeColumns = selectedColumnsInQuery.length
    ? allColumns?.filter((column) =>
        selectedColumnsInQuery.includes(accessFunc(column))
      )
    : allColumns;

  useEffect(() => {
    if (allColumns) {
      addColumns(activeColumns.map((column) => accessFunc(column)) ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColumnsInQuery, allColumns]);
  return activeColumns || [];
};

export default useColumns;
