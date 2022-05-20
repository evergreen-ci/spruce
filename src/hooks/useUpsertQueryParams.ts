import { useLocation } from "react-router-dom";
import { queryString, url } from "utils";
import { useUpdateURLQueryParams } from "./useUpdateURLQueryParams";

const { upsertQueryParam } = url;
const { parseQueryString } = queryString;

const useUpsertQueryParams = () => {
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const onSubmit = ({
    category,
    value,
  }: {
    category: string;
    value: string;
  }) => {
    const selectedParams = queryParams[category] as string[];
    const updatedParams = upsertQueryParam(selectedParams, value);
    updateQueryParams({ [category]: updatedParams });
  };

  return onSubmit;
};
export { useUpsertQueryParams };
