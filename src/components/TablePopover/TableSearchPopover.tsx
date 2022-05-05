import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import TextInput from "@leafygreen-ui/text-input";
import { PopoverContainer } from "components/styles/Popover";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { gray, focus } = uiColors;

interface TableSearchPopoverProps {
  value: string;
  onChange: (search: string) => void;
  onConfirm: () => void;
  "data-cy"?: string;
  placeholder?: string;
}

export const TableSearchPopover: React.VFC<TableSearchPopoverProps> = ({
  value,
  onChange,
  onConfirm,
  "data-cy": dataCy,
  placeholder,
}) => {
  const [active, setActive] = useState(false);
  const iconColor = value === "" ? gray.dark2 : focus;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const closePopup = () => {
    onConfirm();
    setActive(false);
  };

  return (
    <Wrapper>
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
        <PopoverContainer ref={popoverRef}>
          <TextInput
            description="Press enter to filter."
            placeholder={placeholder}
            type="search"
            aria-label="input-filter"
            data-cy="input-filter"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && closePopup()}
            autoFocus
          />
        </PopoverContainer>
      </Popover>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: ${size.xxs};
`;
