import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { PAGE_SIZES } from "constants/index";
import usePageSizeSelector from "./usePageSizeSelector";

interface Props {
  value: number;
  "data-cy"?: string;
  onClick?: (i: number) => void;
  onChange?: (i: number) => void;
  sendAnalyticsEvent?: () => void;
}

const PageSizeSelector: React.VFC<Props> = ({
  value,
  "data-cy": dataCy,
  onChange,
}) => (
  <StyledSelect
    aria-labelledby="page-size-select"
    size="small"
    value={value.toString()}
    onChange={(pageSize: string) => onChange(parseInt(pageSize, 10))}
    allowDeselect={false}
    data-cy={dataCy}
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
