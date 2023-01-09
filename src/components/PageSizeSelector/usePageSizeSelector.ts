import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { useQueryParams } from "hooks/useQueryParam";

/** usePageSizeSelector updates the page size query param and saves the page size to local storage */
const usePageSizeSelector = () => {
  const [, setQueryParams] = useQueryParams();
  const setPageSize = (pageSize: number) => {
    const newPageSize = pageSize.toString();
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, newPageSize);
    setQueryParams({ limit: newPageSize, page: "0" });
  };
  return setPageSize;
};

export default usePageSizeSelector;
