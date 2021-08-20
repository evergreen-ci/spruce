import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "components/Icon";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { MainlineCommitQueryParams } from "types/commits";

interface PaginationButtonsProps {
  nextPageOrderNumber?: number;
  prevPageOrderNumber?: number;
}
export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  prevPageOrderNumber,
  nextPageOrderNumber,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();

  const onNextClick = () => {
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]: nextPageOrderNumber.toString(),
    });
  };
  const onPrevClick = () => {
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]: prevPageOrderNumber.toString(),
    });
  };
  return (
    <Container>
      <StyledButton
        disabled={prevPageOrderNumber === null}
        /* @ts-expect-error */
        onClick={onPrevClick}
      >
        <Icon glyph="ChevronLeft" />
      </StyledButton>
      <StyledButton
        disabled={nextPageOrderNumber === null}
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
