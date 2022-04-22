import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface Props {
  filteredCount: number;
  taskCount: number;
  limit: number;
  page: number;
  defaultSortMethod: string;
}

export const TabTableControl: React.VFC<Props> = ({
  filteredCount,
  taskCount,
  limit,
  page,
  defaultSortMethod,
}) => {
  const { id: versionId } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(versionId);

  const updateQueryParams = useUpdateURLQueryParams();

  const onClearAll = () => {
    sendEvent({ name: "Clear all filter" });
    updateQueryParams({
      taskName: undefined,
      variant: undefined,
      page: undefined,
      sorts: defaultSortMethod,
    });
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
          sendAnalyticsEvent={() => sendEvent({ name: "Change Page Size" })}
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
