import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { Select as AntdSelect } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { PAGE_SIZES, RECENT_PAGE_SIZE_KEY } from "constants/index";
import { queryString } from "utils";

const { stringifyQuery, parseQueryString } = queryString;

const { Option: AntdOption } = AntdSelect;

interface Props {
  value: number;
  "data-cy"?: string;
  onClick?: (i: number) => void;
  sendAnalyticsEvent?: () => void;
  useLeafygreen?: boolean;
}

export const PageSizeSelector: React.VFC<Props> = ({
  value,
  "data-cy": dataCy,
  onClick,
  sendAnalyticsEvent = () => undefined,
  useLeafygreen = false,
}) => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const handleChange =
    onClick ||
    ((pageSize: number) => {
      localStorage.setItem(RECENT_PAGE_SIZE_KEY, `${pageSize}`);
      replace(
        `${pathname}?${stringifyQuery({
          ...parseQueryString(search),
          limit: pageSize,
          page: 0,
        })}`
      );
      sendAnalyticsEvent();
    });

  return useLeafygreen ? (
    <StyledSelect
      aria-labelledby="page-size-select"
      size="small"
      value={value.toString()}
      onChange={(pageSize: string) => handleChange(parseInt(pageSize, 10))}
      allowDeselect={false}
    >
      {PAGE_SIZES.map((limit) => (
        <Option
          key={limit}
          value={limit.toString()}
        >{`${limit} / page`}</Option>
      ))}
    </StyledSelect>
  ) : (
    <AntdSelect
      data-cy={dataCy}
      value={value}
      style={{ width: 120 }}
      onChange={handleChange}
    >
      {PAGE_SIZES.map((limit) => (
        <AntdOption
          data-cy={`${dataCy}-${limit}`}
          key={limit}
          value={limit}
        >{`${limit} / page`}</AntdOption>
      ))}
    </AntdSelect>
  );
};

// @ts-expect-error
const StyledSelect = styled(Select)`
  width: 120px;
`;
