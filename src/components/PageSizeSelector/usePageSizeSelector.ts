import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { useQueryParams } from "hooks/useQueryParam";

/**
 * `usePageSizeSelector` updates the page size query param and saves the page size to local storage
 * @returns - a function that updates the page size query param
 */
const usePageSizeSelector = () => {
  const [queryParams, setQueryParams] = useQueryParams();
  const setPageSize = (pageSize: number) => {
    const newPageSize = pageSize.toString();
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, newPageSize);
    setQueryParams({ ...queryParams, limit: newPageSize, page: "0" });
  };
  return setPageSize;
};

export default usePageSizeSelector;
