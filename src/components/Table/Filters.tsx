import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { FilterDropdownProps } from "antd/es/table/interface";
import { CheckboxGroup } from "components/Checkbox";
import Icon from "components/Icon";
import { tableInputContainerCSS } from "components/styles/Table";
import {
  TreeDataEntry,
  TreeSelect,
  TreeSelectProps,
} from "components/TreeSelect";
import { fontSize } from "constants/tokens";

const { black, gray } = palette;
const defaultColor = gray.light1;

export interface InputFilterProps {
  "data-cy"?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilter: () => void;
  visible?: boolean;
}

export const InputFilter = ({
  placeholder,
  value,
  onChange,
  onFilter,
  "data-cy": dataCy,
  visible,
}: InputFilterProps) => {
  const inputEl = useRef(null);

  useEffect(() => {
    if (visible && inputEl?.current) {
      // timeout prevents race condition with antd table animation
      const timer = setTimeout(() => {
        inputEl.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible, inputEl]);

  return (
    <FilterWrapper data-cy={`${dataCy}-wrapper`}>
      <TextInput
        description="Press enter to filter."
        type="search"
        aria-label="Search Table"
        data-cy={`${dataCy}-input-filter`}
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
    <StyledFilterWrapper>
      <Icon
        glyph="MagnifyingGlass"
        fill={value.length > 0 ? black : defaultColor}
        data-cy={dataCy}
      />
    </StyledFilterWrapper>
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
    <StyledFilterWrapper>
      <Icon
        glyph="Filter"
        fill={state.length > 0 ? black : defaultColor}
        data-cy={dataCy}
      />
    </StyledFilterWrapper>
  ),
});

export interface CheckboxFilterProps {
  dataCy?: string;
  statuses: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxFilter = ({
  statuses,
  value,
  onChange,
  dataCy,
}: CheckboxFilterProps) => (
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
  filterDropdown: ({ confirm }: FilterDropdownProps) => (
    <CheckboxFilter
      statuses={statuses}
      value={value}
      onChange={(e, key) => {
        onChange(e, key);
        confirm({ closeDropdown: true });
      }}
      dataCy={dataCy}
    />
  ),
  filterIcon: () => (
    <StyledFilterWrapper>
      <Icon
        glyph="Filter"
        fill={value.length > 0 ? black : defaultColor}
        data-cy={dataCy}
      />
    </StyledFilterWrapper>
  ),
});

const FilterWrapper = styled.div`
  ${tableInputContainerCSS}
  min-width: 200px; // need to set this as side effect of getPopupContainer
  font-weight: normal; // need to set this as side effect of getPopupContainer
`;

const StyledFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: center;
  font-size: ${fontSize.l};
`;
