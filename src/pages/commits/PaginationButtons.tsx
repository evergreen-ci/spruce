import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Icon from "components/Icon";
import { size } from "constants/tokens";
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
    // 0 is the first page so we can just omit the query param
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]:
        prevPageOrderNumber > 0 ? prevPageOrderNumber.toString() : undefined,
    });
  };
  return (
    <Container>
      <StyledButton
        disabled={prevPageOrderNumber === null}
        // @ts-expect-error
        onClick={onPrevClick}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        data-cy="prev-page-button"
      />
      <StyledButton
        disabled={nextPageOrderNumber === null}
        // @ts-expect-error
        onClick={onNextClick}
        leftGlyph={<Icon glyph="ChevronRight" />}
        data-cy="next-page-button"
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
  align-self: flex-end;
`;
