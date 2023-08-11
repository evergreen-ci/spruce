import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { size } from "constants/tokens";

interface Props {
  filteredCount: number;
  totalCount: number;
  limit: number;
  page: number;
  label: string;
  onClear: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (page: number) => void;
}

const TableControl: React.FC<Props> = ({
  filteredCount,
  label,
  limit,
  onClear,
  onPageChange,
  onPageSizeChange,
  page,
  totalCount,
}) => {
  const setPageSize = usePageSizeSelector();

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    onPageSizeChange?.(pageSize);
  };
  const onClearAll = () => {
    onClear();
  };

  return (
    <TableControlOuterRow>
      <FlexContainer>
        <ResultCountLabel
          dataCyNumerator="filtered-count"
          dataCyDenominator="total-count"
          label={label}
          numerator={filteredCount}
          denominator={totalCount}
        />
        <PaddedButton
          onClick={onClearAll}
          data-cy="clear-all-filters"
          size="small"
        >
          Clear all filters
        </PaddedButton>
      </FlexContainer>
      <TableControlInnerRow>
        <Pagination
          data-cy="tasks-table-pagination"
          currentPage={page}
          totalResults={filteredCount}
          pageSize={limit}
          onChange={onPageChange}
        />
        <PageSizeSelector
          data-cy="tasks-table-page-size-selector"
          value={limit}
          onChange={handlePageSizeChange}
        />
      </TableControlInnerRow>
    </TableControlOuterRow>
  );
};

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PaddedButton = styled(Button)`
  margin-left: ${size.m};
`;

export default TableControl;
