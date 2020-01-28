import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

enum RequiredQueryParams {
  Sort = "sort",
  Cat= "category"
}
export const TestTable: React.FC = () => {
  const { search } = useLocation();
  useEffect(() => {
    const parsed = queryString.parse(search);
    if(parsed["sort"] != )
  }, [search]);
  return <div>Test table</div>;
};
