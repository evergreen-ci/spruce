import { useLocation } from "react-router";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, url } from "utils";

const { upsertQueryParam } = url;
const { parseQueryString } = queryString;

const useTupleSelectQueryParams = () => {
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

export default useTupleSelectQueryParams;
