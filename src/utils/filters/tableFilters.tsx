import React from "react";
import { Input, Icon } from "antd";
import { Button } from "components/Button";
import { TreeDataEntry, renderCheckboxes } from "components/TreeSelect";
import styled from "@emotion/styled";

interface SearchFilterParams {
  dataCy: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

export const getColumnSearchFilterProps = ({
  dataCy,
  placeholder,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}: SearchFilterParams) => ({
  filterDropdown: () => (
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
  ),
  filterIcon: () => (
    <Icon type="search" style={{ color: value ? "#1890ff" : undefined }} />
  ),
});

interface TreeSelectFilterParams<TreeData> {
  dataCy: string;
  statuses: TreeData;
  value: string[];
  onChange: (v: string[]) => void;
  updateUrlParam: () => void;
  resetUrlParam: () => void;
}

export const getColumnTreeSelectFilterProps = <
  TreeData extends TreeDataEntry[]
>({
  statuses,
  value,
  onChange,
  updateUrlParam,
  resetUrlParam,
}: TreeSelectFilterParams<TreeData>) => ({
  filterDropdown: () => (
    <FilterWrapper>
      {renderCheckboxes({
        tData: statuses,
        state: value,
        onChange,
        hasParent: false,
      })}
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button onClick={resetUrlParam} size="small">
            Reset
          </Button>
        </ButtonWrapper>
        <Button size="small" variant="primary" onClick={updateUrlParam}>
          Search
        </Button>
      </ButtonsWrapper>
    </FilterWrapper>
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
