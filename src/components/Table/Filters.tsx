import React from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Input } from "antd";
import { Button } from "components/Button";
import { CheckboxGroup } from "components/Checkbox";
import { TreeSelect } from "components/TreeSelect";
import { TreeDataEntry } from "components/TreeSelect";

export interface InputFilterProps {
  dataCy?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

const getStyle = (value: string[] | string) =>
  value.length ? { color: uiColors.blue.base } : {};

export const getColumnSearchFilterProps = ({
  dataCy,
  placeholder,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}: InputFilterProps) => ({
  filterDropdown:
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
          <Button data-cy="reset-button" size="small" onClick={resetUrlParam}>
            Reset
        </Button>
        </ButtonWrapper>
        <Button
          data-cy="filter-button"
          size="small"
          variant="primary"
          onClick={updateUrlParam}
        >
          Search
      </Button>
      </ButtonsWrapper>
    </FilterWrapper>
  ,
  filterIcon: (
    <SearchOutlined
      data-cy={dataCy}
      style={getStyle(value)}
    />
  ),
});

export const getColumnTreeSelectProps = ({
  dataCy,
  statuses,
  tData,
  label,
  onChange,
  onSubmit,
  onReset
}: any) => ({
  filterDropdown: (
    <FilterWrapper data-cy={`${dataCy}-wrapper`}>
      <TreeSelect
        state={statuses}
        tData={tData}
        inputLabel={`${label}: `}
        data-cy={`${dataCy}-treeselect`}
        onChange={onChange}
        alwaysOpen
      />
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button data-cy={`${dataCy}-reset-btn`} size="small" onClick={onReset}>
            Reset
        </Button>
        </ButtonWrapper>
        <Button
          data-cy={`${dataCy}-search-btn`}
          size="small"
          variant="primary"
          onClick={onSubmit}
        >
          Search
      </Button>
      </ButtonsWrapper>
    </FilterWrapper>
  ),
  filterIcon: (
    <SearchOutlined
      data-cy={dataCy}
      style={getStyle(statuses)}
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
        <Button data-cy="reset-button" onClick={resetUrlParam} size="small">
          Reset
        </Button>
      </ButtonWrapper>
      <Button
        data-cy="filter-button"
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
    <FilterOutlined
      data-cy={dataCy}
      style={getStyle(value)}
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
