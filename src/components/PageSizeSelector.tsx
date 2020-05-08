import React from "react";
import { Select } from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const { Option } = Select;

interface Props {
  value: number;
}

export const PageSizeSelector = ({ value }: Props) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const handleChange = (pageSize: number) => {
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          limit: pageSize,
          page: 0,
        },
        { arrayFormat }
      )}`
    );
  };

  return (
    <Select value={value} style={{ width: 120 }} onChange={handleChange}>
      {PAGE_SIZES.map((limit) => (
        <Option value={limit}>{`${limit} / page`}</Option>
      ))}
    </Select>
  );
};

export const PAGE_SIZES = [10, 20, 50, 100];
const arrayFormat = "comma";
