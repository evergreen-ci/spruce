import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { PAGE_SIZES } from "constants/index";
import { zIndex } from "constants/tokens";
import usePageSizeSelector from "./usePageSizeSelector";

interface Props {
  value: number;
  onChange: (i: number) => void;
}

/**
 * `data-*` props are not currently supported by @leafygreen-ui/select
 *  https://jira.mongodb.org/browse/EVG-16932
 * @param props - React props passed to the component
 * @param props.value - The current page size
 * @param props.onChange - Callback to be called when the page size is changed
 * @returns The PageSizeSelector component
 */
const PageSizeSelector: React.FC<Props> = ({ onChange, value, ...rest }) => (
  <StyledSelect
    aria-labelledby="page-size-select"
    size="small"
    value={value.toString()}
    onChange={(pageSize: string) => onChange(parseInt(pageSize, 10))}
    allowDeselect={false}
    popoverZIndex={zIndex.popover}
    {...rest}
  >
    {PAGE_SIZES.map((limit) => (
      <Option key={limit} value={limit.toString()}>{`${limit} / page`}</Option>
    ))}
  </StyledSelect>
);

const StyledSelect = styled(Select)`
  width: 120px;
`;

export { usePageSizeSelector };
export default PageSizeSelector;
