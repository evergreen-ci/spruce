import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export const TestTable: React.FC = () => {
  const { search } = useLocation();
  useEffect(() => {
    const parsed = queryString.parse(search);
    console.log(parsed);
  }, [search]);
  return <div>Test table</div>;
};
