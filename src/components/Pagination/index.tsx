import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Disclaimer } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

interface Props {
  currentPage: number;
  onChange?: (i: number) => void;
  totalResults: number;
  pageSize: number;
}

/**
 * Pagination component for navigating between pages of data
 * By default it will update the page query param in the URL
 * @param props - React props passed to the component
 * @param props.currentPage - the current page
 * @param props.onChange - optional callback for when the page changes (Will override the default behavior of updating the URL query param)
 * @param props.totalResults - total number of results
 * @param props.pageSize - maximum number of results per page
 * @returns The Pagination component
 */
const Pagination: React.FC<Props> = ({
  currentPage,
  onChange,
  pageSize,
  totalResults,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const handleChange =
    onChange ||
    ((page: number) => updateQueryParams({ page: page.toString() }));
  const numPages = Math.ceil(totalResults / pageSize);

  const handlePrevClick = () => {
    handleChange(currentPage - 1);
  };
  const handleNextClick = () => {
    handleChange(currentPage + 1);
  };

  return (
    <Container data-cy="pagination">
      <StyledButton
        disabled={currentPage === 0}
        size="small"
        data-cy="prev-page-button"
        onClick={handlePrevClick}
        leftGlyph={<Icon glyph="ChevronLeft" size="small" />}
      />
      <PageLabel>
        <Disclaimer>
          {numPages > 0 ? currentPage + 1 : 0} / {numPages}
        </Disclaimer>
      </PageLabel>
      <StyledButton
        disabled={numPages === 0 || currentPage === numPages - 1}
        data-cy="next-page-button"
        size="small"
        onClick={handleNextClick}
        leftGlyph={<Icon glyph="ChevronRight" size="small" />}
      />
    </Container>
  );
};

const StyledButton = styled(Button)`
  margin-right: ${size.xxs};
  margin-left: ${size.xxs};
`;

const PageLabel = styled.div`
  width: 48px;
  text-align: center;
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
`;

export default Pagination;
