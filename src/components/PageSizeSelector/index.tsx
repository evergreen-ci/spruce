import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { PAGE_SIZES } from "constants/index";
import usePageSizeSelector from "./usePageSizeSelector";

interface Props {
  value: number;
  onChange: (i: number) => void;
}

/**
 * `data-*` props are not currently supported by @leafygreen-ui/select
 *  https://jira.mongodb.org/browse/EVG-16932
 */
const PageSizeSelector: React.VFC<Props> = ({ value, onChange, ...rest }) => (
  <StyledSelect
    aria-labelledby="page-size-select"
    size="small"
    value={value.toString()}
    onChange={(pageSize: string) => onChange(parseInt(pageSize, 10))}
    allowDeselect={false}
    {...rest}
  >
    {PAGE_SIZES.map((limit) => (
      <Option key={limit} value={limit.toString()}>{`${limit} / page`}</Option>
    ))}
  </StyledSelect>
);

// @ts-expect-error
const StyledSelect = styled(Select)`
  width: 120px;
`;

export { usePageSizeSelector };
export default PageSizeSelector;
