import React, { useEffect } from "react";
import { Select } from "antd";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

const { Option } = Select;

interface Props {
  value: number;
  dataCy?: string;
  sendAnalyticsEvent?: () => void;
}

export const PageSizeSelector: React.FC<Props> = ({
  value,
  dataCy,
  sendAnalyticsEvent = () => undefined,
}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const handleChange = (pageSize: number) => {
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, `${pageSize}`);
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

  useEffect(() => {
    console.log("Was rendered");
  });

  return (
    <Select
      data-cy={dataCy}
      value={value}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      {PAGE_SIZES.map((limit) => (
        <Option
          data-cy={`${dataCy}-${limit}`}
          key={limit}
          value={limit}
        >{`${limit} / page`}</Option>
      ))}
    </Select>
  );
};

export const RECENT_PAGE_SIZE_KEY = "recentPageSize";

const DEFAULT_PAGE_SIZE = 10;

const arrayFormat = "comma";

export const PAGE_SIZES = [10, 20, 50, 100];

export const getDefaultPageSize = () => {
  const pageSizeFromLocalStorage: number = parseInt(
    localStorage.getItem(RECENT_PAGE_SIZE_KEY),
    DEFAULT_PAGE_SIZE
  );

  return PAGE_SIZES.includes(pageSizeFromLocalStorage)
    ? pageSizeFromLocalStorage
    : DEFAULT_PAGE_SIZE;
};
