import React from "react";
import { Select } from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const { Option } = Select;

interface Props {
  value: number;
  dataTestId?: string;
  sendAnalyticsEvent?: () => void;
}

export const PageSizeSelector: React.FC<Props> = ({
  value,
  dataTestId,
  sendAnalyticsEvent = () => undefined,
}) => {
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
    sendAnalyticsEvent();
  };

  return (
    <Select
      data-test-id={dataTestId}
      value={value}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      {PAGE_SIZES.map((limit) => (
        <Option
          data-test-id={`${dataTestId}-${limit}`}
          key={limit}
          value={limit}
        >{`${limit} / page`}</Option>
      ))}
    </Select>
  );
};

export const PAGE_SIZES = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;
const arrayFormat = "comma";
