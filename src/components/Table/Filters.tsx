import React from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Input } from "antd";
import { Button } from "components/Button";
import { CheckboxGroup } from "components/Checkbox";
import { FilterInputControls } from "components/FilterInputControls";
import { tableInputContainerCSS } from "components/styles/Layout";
import { TreeDataEntry } from "components/TreeSelect";

export interface InputFilterProps {
  "data-cy"?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter: () => void;
  onReset: () => void;
  submitButtonCopy?: string;
}

export const InputFilter: React.FC<InputFilterProps> = ({
  placeholder,
  value,
  onChange,
  onFilter,
  onReset,
  "data-cy": dataCy,
  submitButtonCopy,
}) => (
  <FilterWrapper data-cy={`${dataCy}-wrapper`}>
    <Input
      data-cy="input-filter"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onPressEnter={onFilter}
    />
    <FilterInputControls
      onClickSubmit={onFilter}
      onClickReset={onReset}
      submitButtonCopy={submitButtonCopy}
    />
  </FilterWrapper>
);

export const getColumnSearchFilterProps = ({
  "data-cy": dataCy,
  placeholder,
  value,
  onChange,
  onFilter,
  onReset,
}: InputFilterProps) => ({
  filterDropdown: (
    <InputFilter
      {...{
        placeholder,
        value,
        onChange,
        onFilter,
        onReset,
        "data-cy": dataCy,
      }}
    />
  ),
  filterIcon: () => (
    <SearchOutlined
      data-cy={dataCy}
      style={{ color: value ? uiColors.blue.base : undefined }}
    />
  ),
});

export interface CheckboxFilterProps {
  dataCy?: string;
  statuses: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onFilter: () => void;
  onReset: () => void;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  statuses,
  value,
  onChange,
  onFilter,
  onReset,
  dataCy,
}) => (
  <FilterWrapper data-cy={`${dataCy}-wrapper`}>
    <CheckboxGroup value={value} data={statuses} onChange={onChange} />
    <ButtonsWrapper>
      <ButtonWrapper>
        <Button data-cy="reset-button" onClick={onReset} size="small">
          Reset
        </Button>
      </ButtonWrapper>
      <Button
        data-cy="filter-button"
        size="small"
        variant="primary"
        onClick={onFilter}
      >
        Filter
      </Button>
    </ButtonsWrapper>
  </FilterWrapper>
);

export const getColumnCheckboxFilterProps = ({
  statuses,
  value,
  onChange,
  onFilter,
  onReset,
  dataCy,
}: CheckboxFilterProps) => ({
  filterDropdown: () => (
    <CheckboxFilter
      {...{
        statuses,
        value,
        onChange,
        onFilter,
        onReset,
        dataCy,
      }}
    />
  ),
  filterIcon: () => (
    <FilterOutlined
      data-cy={dataCy}
      style={{ color: value.length ? uiColors.blue.base : undefined }}
    />
  ),
});

const FilterWrapper = styled.div`
  ${tableInputContainerCSS}
`;
const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-top: 32px;
`;
const ButtonWrapper = styled.div`
  margin-right: 8px;
`;
