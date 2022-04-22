import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import Icon from "components/Icon";
import { IconTooltip } from "components/IconTooltip";
import { useUpsertQueryParams } from "hooks";
import { TestStatus } from "types/history";
import { validators } from "utils";

const { validateRegexp } = validators;
const { yellow } = uiColors;

interface HistoryTableTestSearchProps {
  onSubmit?: () => void;
}

export const HistoryTableTestSearch: React.VFC<HistoryTableTestSearchProps> = ({
  onSubmit = () => {},
}) => {
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState(validateRegexp(input));
  const handleSubmit = useUpsertQueryParams();

  const handleOnChange = (value: string) => {
    setInput(value);
    setIsValid(validateRegexp(value));
  };
  const handleOnSubmit = () => {
    onSubmit();
    handleSubmit({ category: TestStatus.Failed, value: input });
    setInput("");
  };

  return (
    <ContentWrapper>
      <TextInputWrapper>
        <TextInput
          type="search"
          label="Filter by Failed Tests"
          aria-label="history-table-test-search-input"
          value={input}
          placeholder="Search test name regex"
          onChange={(e) => handleOnChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleOnSubmit()}
        />
        {isValid ? (
          <StyledIcon
            glyph="Plus"
            onClick={handleOnSubmit}
            aria-label="Select plus button"
            data-cy="tuple-select-button"
          />
        ) : (
          <IconTooltip
            css={iconPositionStyles}
            glyph="Warning"
            tooltipText="Invalid Regular Expression"
            data-cy="tuple-select-warning"
            fill={yellow.base}
          />
        )}
      </TextInputWrapper>
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  min-width: 200px; //temporary
  padding-right: 30px;
`;

const TextInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const iconPositionStyles = css`
  position: absolute;
  height: 100%;
  top: 10px; //temporary
  align-self: flex-end;
  margin-right: 10px;
  justify-content: center;
`;

const StyledIcon = styled(Icon)`
  ${iconPositionStyles}
  &:hover {
    cursor: pointer;
  }
`;
