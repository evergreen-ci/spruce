import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { queryString, array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";

const { parseQueryString } = queryString;
const { toArray } = array;

const useColumns = <T>(
  queryParam: string,
  allColumns: T[],
  accessFunc: (column: T) => string
) => {
  const { search } = useLocation();
  const queryParams = useMemo(() => parseQueryString(search), [search]);
  const { addColumns } = useHistoryTable();

  const selectedColumnsInQuery = useMemo(
    () => queryParams[queryParam] && toArray(queryParams[queryParam]),
    [queryParams, queryParam]
  );

  const selectedColumns = selectedColumnsInQuery
    ? allColumns.filter((column) =>
        selectedColumnsInQuery.includes(accessFunc(column))
      )
    : allColumns;

  useEffect(() => {
    addColumns(selectedColumns?.map((column) => accessFunc(column)) ?? []);
  }, [addColumns, selectedColumns, accessFunc]);
  return selectedColumns || [];
};

export default useColumns;
