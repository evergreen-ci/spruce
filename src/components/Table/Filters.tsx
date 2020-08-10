import React from "react";
import { Input, Icon } from "antd";
import { Button } from "components/Button";
import { TreeDataEntry } from "components/TreeSelect";
import { CheckboxGroup } from "components/Checkbox";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

export interface InputFilterProps {
  dataCy?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

export const InputFilter: React.FC<InputFilterProps> = ({
  placeholder,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
  dataCy,
}) => (
  <FilterWrapper data-cy={`${dataCy}-wrapper`}>
    <Input
      data-cy="input-filter"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onPressEnter={updateUrlParam}
    />
    <ButtonsWrapper>
      <ButtonWrapper>
        <Button dataCy="reset-button" size="small" onClick={resetUrlParam}>
          Reset
        </Button>
      </ButtonWrapper>
      <Button
        dataCy="filter-button"
        size="small"
        variant="primary"
        onClick={updateUrlParam}
      >
        Search
      </Button>
    </ButtonsWrapper>
  </FilterWrapper>
);

export const getColumnSearchFilterProps = ({
  dataCy,
  placeholder,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}: InputFilterProps) => ({
  filterDropdown: () => (
    <InputFilter
      {...{
        placeholder,
        value,
        onChange,
        updateUrlParam,
        resetUrlParam,
        dataCy,
      }}
    />
  ),
  filterIcon: () => (
    <Icon
      data-cy={dataCy}
      type="search"
      style={{ color: value ? uiColors.blue.base : undefined }}
    />
  ),
});

export interface CheckboxFilterProps {
  dataCy?: string;
  statuses: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  statuses,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
  dataCy,
}) => (
  <FilterWrapper data-cy={`${dataCy}-wrapper`}>
    <CheckboxGroup value={value} data={statuses} onChange={onChange} />
    <ButtonsWrapper>
      <ButtonWrapper>
        <Button dataCy="reset-button" onClick={resetUrlParam} size="small">
          Reset
        </Button>
      </ButtonWrapper>
      <Button
        dataCy="filter-button"
        size="small"
        variant="primary"
        onClick={updateUrlParam}
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
  updateUrlParam,
  resetUrlParam,
  dataCy,
}: CheckboxFilterProps) => ({
  filterDropdown: () => (
    <CheckboxFilter
      {...{
        statuses,
        value,
        onChange,
        updateUrlParam,
        resetUrlParam,
        dataCy,
      }}
    />
  ),
  filterIcon: () => (
    <Icon
      data-cy={dataCy}
      type="filter"
      style={{ color: value.length ? uiColors.blue.base : undefined }}
    />
  ),
});

const FilterWrapper = styled.div`
  padding: 12px;
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
