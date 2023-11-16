import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { MainlineCommitQueryParams } from "types/commits";

interface PaginationButtonsProps {
  nextPageOrderNumber?: number;
  prevPageOrderNumber?: number;
}
export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  nextPageOrderNumber,
  prevPageOrderNumber,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const updateQueryParams = useUpdateURLQueryParams();

  const onNextClick = () => {
    sendEvent({ name: "Paginate", direction: "next" });
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]:
        nextPageOrderNumber.toString(),
    });
  };
  const onPrevClick = () => {
    sendEvent({
      name: "Paginate",
      direction: "previous",
    });
    updateQueryParams({
      [MainlineCommitQueryParams.SkipOrderNumber]:
        prevPageOrderNumber.toString(),
    });
  };
  return (
    <Container>
      <StyledButton
        disabled={
          prevPageOrderNumber === null || prevPageOrderNumber === undefined
        }
        onClick={onPrevClick}
        leftGlyph={<Icon glyph="ChevronLeft" />}
        data-cy="prev-page-button"
      />
      <StyledButton
        disabled={
          nextPageOrderNumber === null || nextPageOrderNumber === undefined
        }
        onClick={onNextClick}
        leftGlyph={<Icon glyph="ChevronRight" />}
        data-cy="next-page-button"
      />
    </Container>
  );
};

const StyledButton = styled(Button)`
  margin-left: ${size.xs};
`;

const Container = styled.div`
  align-self: flex-end;
`;
