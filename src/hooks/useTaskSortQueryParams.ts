import { useEffect } from "react";
import { useGetTaskQueryVariables } from "hooks/useGetTaskQueryVariables";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

export const useTaskSortQueryParams = () => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { sorts } = useGetTaskQueryVariables();

  useEffect(() => {
    if (sorts.length === 0) {
      updateQueryParams({
        sorts: "STATUS:ASC;BASE_STATUS:DESC",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return sorts;
};
