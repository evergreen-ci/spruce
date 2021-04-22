import React from "react";
import { Select } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { PAGE_SIZES, RECENT_PAGE_SIZE_KEY } from "constants/index";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

const { Option } = Select;

interface Props {
  value: number;
  "data-cy"?: string;
  sendAnalyticsEvent?: () => void;
}

export const PageSizeSelector: React.FC<Props> = ({
  value,
  "data-cy": dataCy,
  sendAnalyticsEvent = () => undefined,
}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const handleChange = (pageSize: number) => {
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, `${pageSize}`);
    replace(
      `${pathname}?${stringifyQuery({
        ...parseQueryString(search),
        limit: pageSize,
        page: 0,
      })}`
    );
    sendAnalyticsEvent();
  };

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
