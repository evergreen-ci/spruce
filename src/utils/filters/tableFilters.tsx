import React from "react";
import { Input, Icon } from "antd";
import { Button } from "components/Button";
import { TreeDataEntry, renderCheckboxes } from "components/TreeSelect";

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
    <div style={{ padding: 8 }}>
      <Input
        data-cy={dataCy}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Button size="small" onClick={resetUrlParam}>
        Reset
      </Button>
      <Button size="small" variant="primary" onClick={updateUrlParam}>
        Search
      </Button>
    </div>
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
    <div style={{ padding: 8 }}>
      {renderCheckboxes({
        tData: statuses,
        state: value,
        onChange,
        hasParent: false,
      })}
      <Button onClick={resetUrlParam} size="small">
        Reset
      </Button>
      <Button size="small" variant="primary" onClick={updateUrlParam}>
        Search
      </Button>
    </div>
  ),
  filterIcon: () => (
    <Icon
      type="filter"
      style={{ color: value.length ? "#1890ff" : undefined }}
    />
  ),
});
