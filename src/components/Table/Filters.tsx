import React, { useEffect, useRef } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { Disclaimer } from "@leafygreen-ui/typography";
import { FilterDropdownProps } from "antd/es/table/interface";
import { Button } from "components/Button";
import { CheckboxGroup } from "components/Checkbox";
import { FilterInputControls } from "components/FilterInputControls";
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
  onFilter?: () => void;
  onReset?: () => void;
  submitButtonCopy?: string;
  visible?: boolean;
}

export const InputFilter: React.FC<InputFilterProps> = ({
  placeholder,
  value,
  onChange,
  onFilter,
  onReset,
  "data-cy": dataCy,
  submitButtonCopy,
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
      <FilterDescription> Press enter to filter. </FilterDescription>
      <TextInput
        type="search"
        aria-label="input-filter"
        data-cy="input-filter"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ minWidth: "190px" }}
        onKeyPress={(e) => e.key === "Enter" && onFilter && onFilter()}
        ref={inputEl}
      />
      {onFilter && onReset && (
        <FilterInputControls
          onClickSubmit={onFilter}
          onClickReset={onReset}
          submitButtonCopy={submitButtonCopy}
        />
      )}
    </FilterWrapper>
  );
};

export const getColumnSearchFilterProps = ({
  "data-cy": dataCy,
  placeholder,
  value,
  onChange,
  onFilter,
  onReset,
  submitButtonCopy,
}: InputFilterProps) => ({
  filterDropdown: ({ confirm, visible }: FilterDropdownProps) => (
    <InputFilter
      visible={visible}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      /* Only passing these functions if they are defined */
      {...(onFilter && {
        onFilter: () => {
          onFilter();
          confirm({ closeDropdown: true });
        },
      })}
      {...(onReset && {
        onReset: () => {
          onReset();
          confirm({ closeDropdown: true });
        },
      })}
      data-cy={dataCy}
      submitButtonCopy={submitButtonCopy}
    />
  ),
  filterIcon: () => <StyledSearchOutlined data-cy={dataCy} active={!!value} />,
});

export const getColumnTreeSelectFilterProps = ({
  tData,
  state,
  onChange,
  onFilter,
  onReset,
  "data-cy": dataCy,
}: TreeSelectProps) => ({
  filterDropdown: ({ confirm }: FilterDropdownProps) => (
    <TreeSelect
      data-cy={dataCy}
      state={state}
      tData={tData}
      onChange={onChange}
      /* Only passing these functions if they are defined */
      {...(onFilter && {
        onFilter: () => {
          onFilter();
          confirm({ closeDropdown: true });
        },
      })}
      {...(onReset && {
        onReset: () => {
          onReset();
          confirm({ closeDropdown: true });
        },
      })}
    />
  ),
  filterIcon: () => (
    <StyledFilterOutlined data-cy={dataCy} active={!!state.length} />
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
  filterDropdown: ({ confirm }: FilterDropdownProps) => (
    <CheckboxFilter
      statuses={statuses}
      value={value}
      onChange={onChange}
      onFilter={() => {
        onFilter();
        confirm({ closeDropdown: true });
      }}
      onReset={() => {
        onReset();
        confirm({ closeDropdown: true });
      }}
      dataCy={dataCy}
    />
  ),
  filterIcon: () => (
    <StyledFilterOutlined data-cy={dataCy} active={!!value.length} />
  ),
});

const FilterWrapper = styled.div`
  ${tableInputContainerCSS}
`;
const FilterDescription = styled(Disclaimer)`
  padding-bottom: 12px;
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

interface StyledOutlinedProps {
  active?: boolean;
}
const StyledFilterOutlined = styled(FilterOutlined)<StyledOutlinedProps>`
  font-size: 16px;
  ${({ active }) => active && `color: ${focus}`}
`;

const StyledSearchOutlined = styled(SearchOutlined)<StyledOutlinedProps>`
  font-size: 16px;
  ${({ active }) => active && `color: ${focus}`}
`;
