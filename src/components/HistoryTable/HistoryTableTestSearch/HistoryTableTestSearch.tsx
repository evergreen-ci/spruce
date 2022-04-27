import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import IconTooltip from "components/IconTooltip";
import TextInput from "components/TextInputWithGlyph";
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
  const isValid = validateRegexp(input);
  const handleSubmit = useUpsertQueryParams();

  const handleOnChange = (value: string) => {
    setInput(value);
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
        icon={
          isValid ? (
            <IconButton
              onClick={handleOnSubmit}
              aria-label="Select plus button"
            >
              <Icon glyph="Plus" data-cy="tuple-select-button" />
            </IconButton>
          ) : (
            <IconTooltip
              glyph="Warning"
              data-cy="tuple-select-warning"
              fill={yellow.base}
            >
              Invalid Regular Expression
            </IconTooltip>
          )
        }
      />
    </ContentWrapper>
  );
};

const ContentWrapper = styled.div`
  width: 40%;
  min-width: 200px; //temporary
  margin-right: 30px;
  position: relative;
`;
