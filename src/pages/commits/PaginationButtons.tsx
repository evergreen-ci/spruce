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
      />
      <StyledButton
        disabled={nextPageOrderNumber === null}
        // @ts-expect-error
        onClick={onNextClick}
        leftGlyph={<Icon glyph="ChevronRight" />}
      />
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
