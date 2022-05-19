import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { useUpdateURLQueryParams } from "hooks";

/** usePageSizeSelector updates the page size query param and saves the page size to local storage */
const usePageSizeSelector = () => {
  const updateURLQueryParams = useUpdateURLQueryParams();
  const setPageSize = (pageSize: number) => {
    const newPageSize = pageSize.toString();
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, newPageSize);
    updateURLQueryParams({ limit: newPageSize, page: "0" });
  };
  return setPageSize;
};

export default usePageSizeSelector;
