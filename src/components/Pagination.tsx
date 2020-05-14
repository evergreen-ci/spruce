import React from "react";
import { Pagination as AntPagination } from "antd";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

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
  const updateQueryParams = useUpdateURLQueryParams();
  return (
    <AntPagination
      data-test-id={dataTestId}
      simple
      pageSize={pageSize}
      current={value + 1}
      total={totalResults}
      onChange={(p) => updateQueryParams({ page: `${p - 1}` })}
    />
  );
};
