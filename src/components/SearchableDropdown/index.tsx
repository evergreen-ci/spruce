import { useState, PropsWithChildren, useRef, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Label } from "@leafygreen-ui/typography";
import DropdownButton from "components/DropdownButton";
import Icon from "components/Icon";
import TextInput from "components/TextInputWithGlyph";
import { toggleArray } from "utils/array";

const { gray, blue } = uiColors;

interface SearchableDropdownProps<T> {
  label: string | React.ReactNode;
  value: T | T[];
  onChange: (value: T | T[]) => void;
  searchFunc?: (options: T[], match: string) => T[];
  searchPlaceholder?: string;
  valuePlaceholder?: string;
  options: T[] | string[];
  optionRenderer?: (
    option: T,
    onClick: (selectedV) => void,
    isChecked: (selectedV) => boolean
  ) => React.ReactNode;
  allowMultiSelect?: boolean;
  disabled?: boolean;
  ["data-cy"]?: string;
  buttonRenderer?: (option: T | T[]) => React.ReactNode;
}
const SearchableDropdown = <T extends {}>({
  label,
  value,
  onChange,
  searchFunc,
  searchPlaceholder = "search...",
  valuePlaceholder = "Select an element",
  options,
  optionRenderer,
  allowMultiSelect = false,
  disabled = false,
  "data-cy": dataCy = "searchable-dropdown",
  buttonRenderer,
}: PropsWithChildren<SearchableDropdownProps<T>>) => {
  const [search, setSearch] = useState("");
  const [visibleOptions, setVisibleOptions] = useState(options);
  const dropdownButtonRef = useRef(null);
  // Update options when they change
  useEffect(() => {
    if (options) {
      setVisibleOptions(options);
    }
  }, [options]);

  const onClick = (v: T) => {
    if (allowMultiSelect) {
      if (Array.isArray(value)) {
        const newValue = toggleArray(v, value);
        onChange(newValue);
      } else {
        onChange([v]);
      }
    } else {
      onChange(v);
    }
    // Close the dropdown after user makes a selection only if it isn't a multiselect
    if (!allowMultiSelect) {
      if (dropdownButtonRef.current) {
        dropdownButtonRef.current.setIsOpen(false);
      }
    }
  };

  const option = optionRenderer
    ? (v: T) => optionRenderer(v, onClick, isChecked)
    : (v: T) => (
        <SearchableDropdownOption
          key={`searchable_dropdown_option_${v}`}
          value={v}
          onClick={() => onClick(v)}
          isChecked={isChecked(v)}
        />
      );

  const isChecked = (elementValue: T) => {
    if (typeof value === "string") {
      return value === elementValue;
    }
    if (Array.isArray(value)) {
      // v is included in value
      return value.filter((v) => v === elementValue).length > 0;
    }
  };

  const handleSearch = useMemo(
    () => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value: searchTerm } = e.target;
      setSearch(searchTerm);
      let filteredOptions = [];

      if (searchFunc) {
        // Alias the array as any to avoid TS error https://github.com/microsoft/TypeScript/issues/36390
        filteredOptions = searchFunc(options as T[], searchTerm);
      } else if (typeof options[0] === "string") {
        filteredOptions = (options as string[]).filter(
          (o) => o.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        );
      } else {
        console.error(
          "A searchFunc must be supplied when options is not of type string[]"
        );
      }
      setVisibleOptions(filteredOptions);
    },
    [searchFunc, options]
  );

  let buttonText = valuePlaceholder;
  if (value) {
    if (typeof value === "string" && value.length !== 0) {
      buttonText = value;
    } else if (Array.isArray(value) && value.length !== 0) {
      buttonText = value.join(", ");
    } else {
      buttonText = value.toString();
    }
  }

  return (
    <Container>
      <Label htmlFor="searchable-dropdown">{label}</Label>
      <Wrapper>
        <DropdownButton
          data-cy={dataCy}
          disabled={disabled}
          buttonText={buttonText}
          buttonRenderer={
            buttonRenderer ? () => buttonRenderer(value) : undefined
          }
          ref={dropdownButtonRef}
        >
          <TextInput
            data-cy={`${dataCy}-search-input`}
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearch}
            glyph="MagnifyingGlass"
            aria-label="Search"
            type="search"
          />
          <ScrollableList>
            {(visibleOptions as T[])?.map((o) => option(o))}
          </ScrollableList>
        </DropdownButton>
      </Wrapper>
    </Container>
  );
};

interface SearchableDropdownOptionProps<T> {
  onClick: (v: T) => void;
  value: T;
  isChecked?: boolean;
  displayName?: string;
}
export const SearchableDropdownOption = <T extends {}>({
  onClick,
  isChecked,
  value,
  displayName,
}: PropsWithChildren<SearchableDropdownOptionProps<T>>) => (
  <Option
    onClick={() => onClick(value)}
    key={`select_${value}`}
    data-cy="searchable-dropdown-option"
  >
    <CheckmarkContainer>
      {isChecked && (
        <Icon glyph="Checkmark" height={12} width={12} fill={blue.base} />
      )}
    </CheckmarkContainer>
    {displayName || value}
  </Option>
);

const ScrollableList = styled.div`
  overflow: scroll;
  max-height: 400px;
`;

const Wrapper = styled.div`
  width: ${(props: { width?: string }): string =>
    props.width ? props.width : ""};
`;

const Option = styled.div`
  width: 100%;
  padding: 10px 12px;
  display: flex;
  flex-direction: row;
  :hover {
    cursor: pointer;
    background-color: ${gray.light1};
  }
`;

const CheckmarkContainer = styled.div`
  width: 24px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SearchableDropdown;
