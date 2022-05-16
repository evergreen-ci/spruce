import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { useUpdateURLQueryParams } from "hooks";

/** usePageSizeSelector updates the page size query param and saves the page size to local storage */
const usePageSizeSelector = () => {
  const updateURLQueryParams = useUpdateURLQueryParams();
  const setPageSize = (pageSize: number) => {
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, `${pageSize}`);
    updateURLQueryParams({ limit: pageSize.toString(), page: "0" });
  };
  return setPageSize;
};

export default usePageSizeSelector;
