import { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import TextInput from "@leafygreen-ui/text-input";
import { PopoverContainer } from "components/styles/Popover";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { blue, gray } = palette;

interface TableSearchPopoverProps {
  "data-cy"?: string;
  onConfirm: (search: string) => void;
  placeholder?: string;
  value: string;
}

export const TableSearchPopover: React.FC<TableSearchPopoverProps> = ({
  "data-cy": dataCy,
  onConfirm,
  placeholder,
  value,
}) => {
  const [input, setInput] = useState(value);
  const [active, setActive] = useState(false);
  const iconColor = value === "" ? gray.dark2 : blue.base;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  // If the value from the URL has changed, update the input.
  useEffect(() => {
    setInput(value);
  }, [value]);

  const onEnter = () => {
    onConfirm(input);
    setActive(false);
  };

  return (
    <SearchWrapper>
      <IconButton
        onClick={() => setActive(!active)}
        active={active}
        data-cy={dataCy}
        aria-label="Table Search Popover Icon"
        ref={buttonRef}
      >
        <Icon glyph="MagnifyingGlass" small="xsmall" color={iconColor} />
      </IconButton>
      <Popover align="bottom" justify="middle" active={active}>
        <PopoverContainer ref={popoverRef} data-cy={`${dataCy}-wrapper`}>
          <TextInput
            description="Press enter to filter."
            placeholder={placeholder}
            type="search"
            aria-label="Search Table"
            data-cy={`${dataCy}-input-filter`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onEnter()}
            autoFocus
          />
        </PopoverContainer>
      </Popover>
    </SearchWrapper>
  );
};

const SearchWrapper = styled.div`
  margin-left: ${size.xxs};
`;
