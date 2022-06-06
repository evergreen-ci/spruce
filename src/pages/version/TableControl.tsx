import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { size } from "constants/tokens";

interface Props {
  filteredCount: number;
  taskCount: number;
  limit: number;
  page: number;
  onClear: () => void;
}

export const TableControl: React.VFC<Props> = ({
  filteredCount,
  taskCount,
  limit,
  page,
  onClear,
}) => {
  const { id: versionId } = useParams<{ id: string }>();
  const versionAnalytics = useVersionAnalytics(versionId);
  const setPageSize = usePageSizeSelector();

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
    versionAnalytics.sendEvent({
      name: "Change Page Size",
    });
  };
  const onClearAll = () => {
    versionAnalytics.sendEvent({ name: "Clear all filter" });
    onClear();
  };

  return (
    <TableControlOuterRow>
      <FlexContainer>
        <ResultCountLabel
          dataCyNumerator="current-task-count"
          dataCyDenominator="total-task-count"
          label="tasks"
          numerator={filteredCount}
          denominator={taskCount}
        />
        <PaddedButton // @ts-expect-error
          onClick={onClearAll}
          data-cy="clear-all-filters"
        >
          Clear All Filters
        </PaddedButton>
      </FlexContainer>
      <TableControlInnerRow>
        <Pagination
          data-cy="tasks-table-pagination"
          pageSize={limit}
          value={page}
          totalResults={filteredCount}
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

// @ts-expect-error
const PaddedButton = styled(Button)`
  margin-left: ${size.m};
`;
