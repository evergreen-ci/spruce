import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";

interface Props {
  onClickReset: () => void;
  onClickSubmit: () => void;
  submitButtonCopy: string;
}

export const FilterInputControls: React.FC<Props> = ({
  onClickSubmit,
  onClickReset,
  submitButtonCopy,
}) => (
  <ButtonsWrapper data-cy="filter-input-controls">
    <ButtonWrapper>
      <Button data-cy="reset-button" size="small" onClick={onClickReset}>
        Reset
      </Button>
    </ButtonWrapper>
    <Button
      data-cy="filter-button"
      size="small"
      variant="primary"
      onClick={onClickSubmit}
    >
      {submitButtonCopy}
    </Button>
  </ButtonsWrapper>
);

const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-top: 32px;
`;
const ButtonWrapper = styled.div`
  margin-right: 8px;
`;
