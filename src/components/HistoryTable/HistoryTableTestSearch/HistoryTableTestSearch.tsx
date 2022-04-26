import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import Icon from "components/Icon";
import IconTooltip from "components/IconTooltip";
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
    if (isValid) {
      onSubmit();
      handleSubmit({ category: TestStatus.Failed, value: input });
      setInput("");
    }
  };

  return (
    <ContentWrapper>
      <TextInput
        type="search"
        label="Filter by Failed Tests"
        aria-label="history-table-test-search-input"
        value={input}
        placeholder="Search test name regex"
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && handleOnSubmit()
        }
      />
      <IconWrapper>
        {isValid ? (
          <IconButton onClick={handleOnSubmit} aria-label="Select plus button">
            <Icon glyph="Plus" data-cy="tuple-select-button" />
          </IconButton>
        ) : (
          <InactiveIconWrapper>
            <IconTooltip
              glyph="Warning"
              data-cy="tuple-select-warning"
              fill={yellow.base}
            >
              Invalid Regular Expression
            </IconTooltip>
          </InactiveIconWrapper>
        )}
      </IconWrapper>
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  width: 40%;
  min-width: 200px; //temporary
  margin-right: 30px;
  position: relative;
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  margin-right: 10px;
  margin-top: 10px;
  position: absolute;
  right: 0;
  top: 0;
`;

const InactiveIconWrapper = styled.div`
  margin: 6px;
`;
