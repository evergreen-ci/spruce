import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import { PAGE_SIZES } from "constants/index";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface PageSizeSelectProps {
  limitNum: number;
}

export const PageSizeSelect: React.FC<PageSizeSelectProps> = ({ limitNum }) => {
  const updateQueryParams = useUpdateURLQueryParams();

  return (
    <StyledSelect
      size="small"
      value={limitNum.toString()}
      onChange={(pageSize: string) =>
        updateQueryParams({ limit: pageSize, page: `${0}` })
      }
      aria-labelledby="tests-per-page"
      allowDeselect={false}
    >
      {PAGE_SIZES.map((limit) => (
        <Option
          key={limit}
          value={limit.toString()}
        >{`${limit} / page`}</Option>
      ))}
    </StyledSelect>
  );
};

// @ts-ignore-error
const StyledSelect = styled(Select)`
  width: 150px;
  margin-right: ${size.xs};
`;
