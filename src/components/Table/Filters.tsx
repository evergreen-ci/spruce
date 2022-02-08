import React, { useEffect, useRef } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { FilterDropdownProps } from "antd/es/table/interface";
import { CheckboxGroup } from "components/Checkbox";
import { tableInputContainerCSS } from "components/styles/Table";
import {
  TreeDataEntry,
  TreeSelect,
  TreeSelectProps,
} from "components/TreeSelect";

const { focus } = uiColors;
export interface InputFilterProps {
  "data-cy"?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter: () => void;
  visible?: boolean;
}

export const InputFilter: React.FC<InputFilterProps> = ({
  placeholder,
  value,
  onChange,
  onFilter,
  "data-cy": dataCy,
  visible,
}) => {
  const inputEl = useRef(null);

  useEffect(() => {
    if (visible && inputEl?.current) {
      // timeout prevents race conditon with antd table animation
      const timer = setTimeout(() => {
        inputEl.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible, inputEl]);

  return (
    <FilterWrapper data-cy={`${dataCy}-wrapper`}>
      <StyledTextInput
        description="Press enter to filter."
        type="search"
        aria-label="input-filter"
        data-cy="input-filter"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={(e) => e.key === "Enter" && onFilter()}
        ref={inputEl}
      />
    </FilterWrapper>
  );
};

export const getColumnSearchFilterProps = ({
  "data-cy": dataCy,
  placeholder,
  value,
  onChange,
  onFilter,
}: InputFilterProps) => ({
  filterDropdown: ({ confirm, visible }: FilterDropdownProps) => (
    <InputFilter
      visible={visible}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFilter={() => {
        onFilter();
        confirm({ closeDropdown: true });
      }}
      data-cy={dataCy}
    />
  ),
  filterIcon: () => (
    <StyledSearchOutlined data-cy={dataCy} active={value ? 1 : 0} />
  ),
});

export const getColumnTreeSelectFilterProps = ({
  tData,
  state,
  onChange,
  "data-cy": dataCy,
}: TreeSelectProps) => ({
  filterDropdown: () => (
    <TreeSelect
      data-cy={dataCy}
      state={state}
      tData={tData}
      onChange={onChange}
    />
  ),
  filterIcon: () => (
    <StyledFilterOutlined data-cy={dataCy} active={state.length ? 1 : 0} />
  ),
});

export interface CheckboxFilterProps {
  dataCy?: string;
  statuses: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  statuses,
  value,
  onChange,
  dataCy,
}) => (
  <FilterWrapper data-cy={`${dataCy}-wrapper`}>
    <CheckboxGroup value={value} data={statuses} onChange={onChange} />
  </FilterWrapper>
);

export const getColumnCheckboxFilterProps = ({
  statuses,
  value,
  onChange,
  dataCy,
}: CheckboxFilterProps) => ({
  filterDropdown: () => (
    <CheckboxFilter
      statuses={statuses}
      value={value}
      onChange={onChange}
      dataCy={dataCy}
    />
  ),
  filterIcon: () => (
    <StyledFilterOutlined data-cy={dataCy} active={value.length ? 1 : 0} />
  ),
});

const FilterWrapper = styled.div`
  ${tableInputContainerCSS}
  min-width: 200px; // need to set this as side effect of getPopupContainer
  font-weight: normal; // need to set this as side effect of getPopupContainer
`;
const StyledTextInput = styled(TextInput)`
  p {
    font-size: 12px;
    padding-bottom: 8px;
  }
`;

interface StyledOutlinedProps {
  active?: number;
}
const StyledFilterOutlined = styled(FilterOutlined)<StyledOutlinedProps>`
  font-size: 16px;
  ${({ active }) => active && `color: ${focus}`}
`;

const StyledSearchOutlined = styled(SearchOutlined)<StyledOutlinedProps>`
  font-size: 16px;
  ${({ active }) => active && `color: ${focus}`}
`;
