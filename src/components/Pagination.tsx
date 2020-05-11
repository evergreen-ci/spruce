import React from "react";
import { Pagination as AntPagination } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

interface Props {
  totalResults: number;
  value: number;
  pageSize: number;
  dataTestId?: string;
}

export const Pagination: React.FC<Props> = ({
  totalResults,
  value,
  pageSize,
  dataTestId,
}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const setPage = (page: number) =>
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          page,
        },
        { arrayFormat }
      )}`
    );

  return (
    <AntPagination
      data-test-id={dataTestId}
      simple
      pageSize={pageSize}
      current={value + 1}
      total={totalResults}
      onChange={(p) => setPage(p - 1)}
    />
  );
};

const arrayFormat = "comma";
