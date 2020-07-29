import React from "react";
import { Input, Icon } from "antd";
import { Button } from "components/Button";
import { TreeDataEntry } from "components/TreeSelect";
import { CheckboxGroup } from "components/Checkbox";
import styled from "@emotion/styled";

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
  dataCy,
  updateUrlParam,
  resetUrlParam,
}) => (
  <FilterWrapper>
    <Input
      data-cy={dataCy}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <ButtonsWrapper>
      <ButtonWrapper>
        <Button size="small" onClick={resetUrlParam}>
          Reset
        </Button>
      </ButtonWrapper>
      <Button size="small" variant="primary" onClick={updateUrlParam}>
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
        dataCy,
        placeholder,
        value,
        onChange,
        updateUrlParam,
        resetUrlParam,
      }}
    />
  ),
  filterIcon: () => (
    <Icon type="search" style={{ color: value ? "#1890ff" : undefined }} />
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
  dataCy,
  statuses,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}) => (
  <FilterWrapper data-cy={dataCy}>
    <CheckboxGroup value={value} data={statuses} onChange={onChange} />
    <ButtonsWrapper>
      <ButtonWrapper>
        <Button onClick={resetUrlParam} size="small">
          Reset
        </Button>
      </ButtonWrapper>
      <Button size="small" variant="primary" onClick={updateUrlParam}>
        Filter
      </Button>
    </ButtonsWrapper>
  </FilterWrapper>
);

export const getColumnTreeSelectFilterProps = ({
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
      type="filter"
      style={{ color: value.length ? "#1890ff" : undefined }}
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
