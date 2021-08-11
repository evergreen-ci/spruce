import { useState, PropsWithChildren, useRef } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body, Label } from "@leafygreen-ui/typography";
import { Input } from "antd";
import Icon from "components/Icon";
import { useOnClickOutside } from "hooks";

const { Search } = Input;
const { gray, white, blue } = uiColors;

interface SearchableDropdownProps<ObjectType> {
  label: string | React.ReactNode;
  value: string | ObjectType[];
  onChange: (value: string | ObjectType) => void;
  searchPlaceholder?: string;
  options: string[] | ObjectType[];
  optionRenderer?: (option: string | ObjectType) => React.ReactNode;
  allowMultiselect?: boolean;
}
const SearchableDropdown = <ObjectType extends { id: string }>({
  label,
  value,
  onChange,
  searchPlaceholder = "search...",
  options,
  optionRenderer,
  allowMultiselect = false,
}: PropsWithChildren<SearchableDropdownProps<ObjectType>>) => {
  const [isVisible, setisVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleOptions, setVisibleOptions] = useState(options);

  const clickRef = useRef(null);
  useOnClickOutside(clickRef, () => setisVisible(false));

  const onClick = (v: string) => {
    onChange(v);
    if (!allowMultiselect) {
      setisVisible(false);
    }
  };
  const option =
    optionRenderer ||
    ((v: string) => (
      <Option onClick={() => onClick(v)}>
        <CheckmarkContainer>
          {value.includes(v) && (
            <Icon glyph="Checkmark" height={12} width={12} fill={blue.base} />
          )}
        </CheckmarkContainer>
        {v}
      </Option>
    ));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const filteredOptions = options.filter(
      (o) => o.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    );
    setVisibleOptions(filteredOptions);
  };

  return (
    <>
      <Label htmlFor="project-select">{label}</Label>
      <Wrapper>
        <BarWrapper
          onClick={() => {
            setisVisible(!isVisible);
          }}
          data-cy="searchable-dropdown"
        >
          <LabelWrapper>
            <Body data-cy="project-name">{value}</Body>
          </LabelWrapper>
          <FlexWrapper>
            <ArrowWrapper>
              <IconButton aria-label="Toggle Dropdown">
                <Icon glyph={isVisible ? "ChevronUp" : "ChevronDown"} />
              </IconButton>
            </ArrowWrapper>
          </FlexWrapper>
        </BarWrapper>
        {isVisible && (
          <RelativeWrapper ref={clickRef}>
            <OptionsWrapper data-cy="project-select-options">
              <Search
                placeholder={searchPlaceholder}
                value={search}
                onChange={handleSearch}
                data-cy="search-input"
              />
              {visibleOptions.map((o) => option(o))}
            </OptionsWrapper>
          </RelativeWrapper>
        )}
      </Wrapper>
    </>
  );
};

const LabelWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarWrapper = styled.div`
  border: 1px solid ${gray.light1};
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
`;

const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: 100%;
  overflow: scroll;
  max-height: 400px;
`;

// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;

const ArrowWrapper = styled.span`
  border-left: 1px solid ${gray.light1};
  padding-left: 5px;
`;

const Wrapper = styled.div`
  width: ${(props: { width?: string }): string =>
    props.width ? props.width : ""};
`;

const FlexWrapper = styled.div`
  display: flex;
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
export default SearchableDropdown;
