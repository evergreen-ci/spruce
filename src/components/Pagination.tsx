import React from "react";
import { Pagination as AntPagination } from "antd";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface Props {
  totalResults: number;
  value: number;
  onChange?: (i: number) => void;
  pageSize: number;
  "data-cy"?: string;
}

export const Pagination: React.FC<Props> = ({
  totalResults,
  value,
  onChange,
  pageSize,
  "data-cy": dataCy,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const handleChange =
    onChange || ((p) => updateQueryParams({ page: `${p - 1}` }));
  return (
    <AntPagination
      data-cy={dataCy}
      simple
      pageSize={pageSize}
      current={value + 1}
      total={totalResults}
      onChange={handleChange}
    />
  );
};
