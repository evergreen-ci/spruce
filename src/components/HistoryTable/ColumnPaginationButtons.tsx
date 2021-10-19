import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "components/Icon";
import { useHistoryTable } from "./HistoryTableContext";

const ColumPaginationButtons: React.FC = () => {
  const {
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = useHistoryTable();

  const onNextClick = () => {
    nextPage();
  };
  const onPrevClick = () => {
    previousPage();
  };
  return (
    <Container>
      <StyledButton
        disabled={!hasPreviousPage}
        /* @ts-expect-error */
        onClick={onPrevClick}
      >
        <Icon glyph="ChevronLeft" />
      </StyledButton>
      <StyledButton
        disabled={!hasNextPage}
        /* @ts-expect-error */
        onClick={onNextClick}
      >
        <Icon glyph="ChevronRight" />
      </StyledButton>
    </Container>
  );
};

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: 4px;
  margin-left: 4px;
`;

const Container = styled.div`
  align-self: flex-end;
`;

export default ColumPaginationButtons;
