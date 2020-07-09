import React from "react";
import { v4 as uuid } from "uuid";
import { Select, Input } from "antd";
import { RegexSelector } from "hooks/useNotificationModal";
import Icon from "@leafygreen-ui/icon";
import { InputLabel } from "components/styles";

const { Option } = Select;

export interface RegexSelectorProps {
  dropdownOptions: RegexSelector[];
  disabledDropdownOptions: string[];
  selectedOption: string;
  onChangeSelectedOption: (optionValue: string) => void;
  onChangeRegexValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  regexInputValue: string;
  onDelete: () => void;
}

export const RegexSelectorInput = ({
  dropdownOptions,
  disabledDropdownOptions,
  selectedOption,
  onChangeSelectedOption,
  onChangeRegexValue,
  onDelete,
  regexInputValue,
}: RegexSelectorProps) => {
  const dropdownId = uuid();
  const inputId = uuid();
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <div>
          <InputLabel htmlFor={dropdownId}>Field name</InputLabel>
        </div>
        <Select
          id={dropdownId}
          data-test-id="notify-by-select"
          value={selectedOption}
          onChange={onChangeSelectedOption}
        >
          {dropdownOptions.map((s) => (
            <Option
              key={s.type}
              disabled={disabledDropdownOptions.includes(s.type)}
              value={s.type}
              data-test-id={`${s.type}-option`}
            >
              {s.typeLabel}
            </Option>
          ))}
        </Select>
      </div>
      <div>matches regex</div>
      <div>
        <div>
          <InputLabel htmlFor={inputId}>Regex</InputLabel>
        </div>
        <Input
          width={456}
          data-cy={`${selectedOption}-input`}
          id={inputId}
          onChange={onChangeRegexValue}
          value={regexInputValue}
          disabled={!selectedOption}
        />
      </div>
      <div>
        <Icon onClick={onDelete} glyph="Trash" />
      </div>
    </div>
  );
};
