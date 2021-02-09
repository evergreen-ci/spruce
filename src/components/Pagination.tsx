import React from "react";
import { Pagination as AntPagination } from "antd";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface Props {
  totalResults: number;
  value: number;
  pageSize: number;
  "data-cy"?: string;
}

export const Pagination: React.FC<Props> = ({
  totalResults,
  value,
  pageSize,
  "data-cy": dataCy,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  return (
    <AntPagination
      data-cy={dataCy}
      simple
      pageSize={pageSize}
      current={value + 1}
      total={totalResults}
      onChange={(p) => updateQueryParams({ page: `${p - 1}` })}
    />
  );
};
