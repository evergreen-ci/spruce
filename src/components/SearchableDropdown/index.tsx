import {
  ChangeEvent,
  useState,
  PropsWithChildren,
  useRef,
  useEffect,
  useMemo,
} from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Label } from "@leafygreen-ui/typography";
import Dropdown from "components/Dropdown";
import Icon from "components/Icon";
import TextInput from "components/TextInputWithGlyph";
import { size } from "constants/tokens";
import { toggleArray } from "utils/array";

const { blue, gray } = palette;

export interface SearchableDropdownProps<T> {
  allowMultiSelect?: boolean;
  buttonRenderer?: (option: T | T[]) => React.ReactNode;
  ["data-cy"]?: string;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange: (value: T | T[]) => void;
  options?: T[] | string[];
  optionRenderer?: (
    option: T,
    onClick: (selectedV) => void,
    isChecked: (selectedV) => boolean,
  ) => React.ReactNode;
  searchFunc?: (options: T[], match: string) => T[];
  searchPlaceholder?: string;
  value: T | T[];
  valuePlaceholder?: string;
}
const SearchableDropdown = <T extends {}>({
  allowMultiSelect = false,
  buttonRenderer,
  "data-cy": dataCy = "searchable-dropdown",
  disabled = false,
  label,
  onChange,
  optionRenderer,
  options,
  searchFunc,
  searchPlaceholder = "search...",
  value,
  valuePlaceholder = "Select an element",
}: PropsWithChildren<SearchableDropdownProps<T>>) => {
  const [search, setSearch] = useState("");
  const [visibleOptions, setVisibleOptions] = useState(options ?? []);
  const DropdownRef = useRef(null);

  // Sometimes options come from a query and we have to wait for the query to complete to know what to show in
  // the dropdown. This hook is used to refresh the options.
  useEffect(() => {
    setVisibleOptions(options ?? []);
  }, [options]);

  // Clear search text input and reset visible options to show every option.
  const resetSearch = () => {
    setSearch("");
    setVisibleOptions(options ?? []);
  };

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
      if (DropdownRef.current) {
        DropdownRef.current.setIsOpen(false);
      }
      resetSearch();
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
          showCheckmark={allowMultiSelect}
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
    () => (e: ChangeEvent<HTMLInputElement>) => {
      const { value: searchTerm } = e.target;
      setSearch(searchTerm);
      let filteredOptions = [];

      if (options) {
        if (searchFunc) {
          // Alias the array as any to avoid TS error https://github.com/microsoft/TypeScript/issues/36390
          filteredOptions = searchFunc(options as T[], searchTerm);
        } else if (typeof options[0] === "string") {
          filteredOptions = (options as string[]).filter(
            (o) => o.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1,
          );
        } else {
          console.error(
            "A searchFunc must be supplied when options is not of type string[]",
          );
        }
      }

      setVisibleOptions(filteredOptions);
    },
    [searchFunc, options],
  );

  let buttonText = valuePlaceholder;
  if (value) {
    if (typeof value === "string" && value.length !== 0) {
      buttonText = value;
    } else if (Array.isArray(value) && value.length !== 0) {
      buttonText = value.join(", ");
    }
  }

  return (
    <Container>
      {label && <Label htmlFor={`searchable-dropdown-${label}`}>{label}</Label>}
      <Wrapper>
        <Dropdown
          id={`searchable-dropdown-${label}`}
          data-cy={dataCy}
          disabled={disabled}
          buttonText={buttonText}
          buttonRenderer={
            buttonRenderer ? () => buttonRenderer(value) : undefined
          }
          onClose={resetSearch}
          ref={DropdownRef}
        >
          <TextInput
            data-cy={`${dataCy}-search-input`}
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearch}
            icon={<Icon glyph="MagnifyingGlass" />}
            aria-label="Search for options"
            type="search"
            autoFocus
          />
          <ScrollableList>
            {(visibleOptions as T[])?.map((o) => option(o))}
          </ScrollableList>
        </Dropdown>
      </Wrapper>
    </Container>
  );
};

interface SearchableDropdownOptionProps<T> {
  isChecked?: boolean;
  onClick: (v: T) => void;
  showCheckmark?: boolean;
  value: T;
}
export const SearchableDropdownOption = <T extends {}>({
  isChecked,
  onClick,
  showCheckmark,
  value,
}: PropsWithChildren<SearchableDropdownOptionProps<T>>) => (
  <Option
    onClick={() => onClick(value)}
    key={`select_${value}`}
    data-cy="searchable-dropdown-option"
  >
    {showCheckmark && (
      <CheckmarkContainer data-cy="checkmark">
        <CheckmarkIcon
          glyph="Checkmark"
          height={12}
          width={12}
          fill={blue.base}
          checked={isChecked}
        />
      </CheckmarkContainer>
    )}
    {value.toString()}
  </Option>
);

const ScrollableList = styled.div`
  margin-top: ${size.xxs};
  overflow: scroll;
  max-height: 400px;
`;

const Wrapper = styled.div`
  width: ${(props: { width?: string }): string =>
    props.width ? props.width : ""};
`;

const Option = styled.button`
  // Remove native button styles.
  border: 0;
  background: none;
  text-align: inherit;
  font: inherit;

  width: 100%;
  word-break: break-word; // Safari
  overflow-wrap: anywhere;
  cursor: pointer;
  padding: ${size.xs} ${size.xs};
  :hover,
  :focus {
    outline: none;
    background-color: ${gray.light2};
  }
`;

const CheckmarkContainer = styled.div`
  margin-right: ${size.xxs};
`;

const CheckmarkIcon = styled(Icon)<{ checked: boolean }>`
  visibility: ${({ checked }) => (checked ? "visible" : "hidden")};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SearchableDropdown;
