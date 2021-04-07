import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

export const useUpdateURLQueryParams = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  return (nextQueryParams: StringMap) =>
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          ...nextQueryParams,
        },
        { arrayFormat }
      )}`
    );
};

interface StringMap {
  [index: string]: string | string[];
}

const arrayFormat = "comma";
