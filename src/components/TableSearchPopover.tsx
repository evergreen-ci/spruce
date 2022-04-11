import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import TextInput from "@leafygreen-ui/text-input";
import { PopoverContainer } from "components/styles/Popover";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { gray, white, focus } = uiColors;

interface TableSearchPopoverProps {
  onConfirm: (search: string) => void;
  "data-cy"?: string;
}

export const TableSearchPopover: React.VFC<TableSearchPopoverProps> = ({
  onConfirm,
  "data-cy": dataCy,
}) => {
  const [active, setActive] = useState(false);
  const [search, setSearch] = useState("");
  const iconColor = search === "" ? gray.dark2 : focus;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const closePopup = () => {
    onConfirm(search);
    setActive(false);
  };

  return (
    <div>
      <IconWrapper
        active={active}
        onClick={() => setActive(!active)}
        data-cy={dataCy}
        ref={buttonRef}
      >
        <Icon glyph="MagnifyingGlass" small="xsmall" color={iconColor} />
      </IconWrapper>
      <Popover align="bottom" justify="middle" active={active}>
        <PopoverContainer ref={popoverRef}>
          <TextInput
            description="Press enter to filter."
            type="search"
            aria-label="input-filter"
            data-cy="input-filter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && closePopup()}
            autoFocus
          />
        </PopoverContainer>
      </Popover>
    </div>
  );
};

const IconWrapper = styled.div<{ active: boolean }>`
  width: ${size.m};
  height: ${size.m};
  margin-left: ${size.xs};
  padding: ${size.xxs};
  border-radius: 50%;
  background-color: ${({ active }) => (active ? gray.light2 : white)};
  transition: background-color 0.3s ease-in-out;
  cursor: pointer;
`;
