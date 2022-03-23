import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { HistoryQueryParams } from "types/history";
import { queryString, array } from "utils";
import { useHistoryTable } from "../HistoryTableContext";

const { parseQueryString } = queryString;
const { toArray } = array;

const useColumns = <T>(allColumns: T[], accessFunc: (column: T) => string) => {
  const { search } = useLocation();
  const { [HistoryQueryParams.VisibleColumns]: queryParams } = useMemo(
    () => parseQueryString(search),
    [search]
  );
  const { addColumns } = useHistoryTable();

  const selectedColumnsInQuery = useMemo(() => toArray(queryParams), [
    queryParams,
  ]);

  const activeColumns = useMemo(
    () =>
      selectedColumnsInQuery.length
        ? allColumns?.filter((column) =>
            selectedColumnsInQuery.includes(accessFunc(column))
          )
        : allColumns,
    // allColumns is not a stable reference and will cause a recalculation of the memoized value
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedColumnsInQuery]
  );

  const visibleColumns = useMemo(
    () => activeColumns?.map((column) => accessFunc(column)) ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeColumns]
  );

  useEffect(() => {
    if (visibleColumns) {
      addColumns(visibleColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleColumns]);

  return activeColumns || [];
};

export default useColumns;
