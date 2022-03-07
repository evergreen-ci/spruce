import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface PaginationButtonsProps {
  numPages: number;
  currentPage: number;
}

export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  numPages,
  currentPage,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const handlePrevClick = () => {
    updateQueryParams({ page: `${currentPage - 1}` });
  };
  const handleNextClick = () => {
    updateQueryParams({ page: `${currentPage + 1}` });
  };

  return (
    <Container>
      <StyledButton
        disabled={currentPage === 0}
        size="small"
        data-cy="prev-page-button"
        /* @ts-expect-error */
        onClick={handlePrevClick}
        leftGlyph={<Icon glyph="ChevronLeft" size="small" />}
      />

      <PageLabel>
        <Disclaimer>
          {currentPage + 1} / {numPages}
        </Disclaimer>
      </PageLabel>

      <StyledButton
        disabled={currentPage === numPages - 1}
        data-cy="next-page-button"
        size="small"
        /* @ts-expect-error */
        onClick={handleNextClick}
        leftGlyph={<Icon glyph="ChevronRight" size="small" />}
      />
    </Container>
  );
};

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: ${size.xxs};
  margin-left: ${size.xxs};
`;

const PageLabel = styled.div`
  width: 48px;
  text-align: center;
`;

const Container = styled.div`
  align-self: flex-end;
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;
