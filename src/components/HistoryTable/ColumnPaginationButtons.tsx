import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useHistoryTable } from "./HistoryTableContext";

export interface PaginationAnalytics {
  direction: "previous" | "next";
}
const ColumnPaginationButtons: React.VFC = () => {
  const {
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
    pageCount,
    currentPage,
  } = useHistoryTable();
  const { sendEvent } = useProjectHealthAnalytics();
  const onClickNext = () => {
    sendEvent({ name: "Paginate history table", direction: "next" });
    nextPage();
  };
  const onClickPrev = () => {
    sendEvent({ name: "Paginate history table", direction: "previous" });
    previousPage();
  };
  return (
    <Container>
      <StyledButton
        disabled={!hasPreviousPage}
        /* @ts-expect-error */
        onClick={onClickPrev}
        data-cy="prev-page-button"
        leftGlyph={<Icon glyph="ChevronLeft" />}
      />
      <Disclaimer>
        {currentPage + 1} / {pageCount}
      </Disclaimer>
      <StyledButton
        disabled={!hasNextPage}
        /* @ts-expect-error */
        onClick={onClickNext}
        data-cy="next-page-button"
        leftGlyph={<Icon glyph="ChevronRight" />}
      />
    </Container>
  );
};

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: ${size.xxs};
  margin-left: ${size.xxs};
`;

const Container = styled.div`
  align-self: flex-start;
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;

export default ColumnPaginationButtons;
