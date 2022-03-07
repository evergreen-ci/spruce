import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import TextInput from "@leafygreen-ui/text-input";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

const { gray, focus } = uiColors;

export const JobLogsPopover: React.FC = () => {
  const updateQueryParams = useUpdateURLQueryParams();

  const [active, setActive] = useState(false);
  const [filter, setFilter] = useState("");
  const iconColor = filter === "" ? gray.dark2 : focus;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const closePopup = () => {
    updateQueryParams({ test: filter || undefined, page: `${0}` });
    setActive(false);
  };

  return (
    <div>
      <IconWrapper
        active={active}
        onClick={() => setActive(!active)}
        data-cy="test-filter-popover"
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
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && closePopup()}
            autoFocus
          />
        </PopoverContainer>
      </Popover>
    </div>
  );
};

const PopoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: ${size.s};
  box-shadow: 0 ${size.xxs} ${size.xs} 0 ${gray.light2},
    0 ${size.xxs} ${size.l} ${size.xxs} ${gray.light2};
`;

const IconWrapper = styled.div<{ active: boolean }>`
  width: ${size.m};
  height: ${size.m};
  margin-left: ${size.xs};
  padding: ${size.xxs};
  border-radius: 50%;
  background-color: ${({ active }) => (active ? gray.light2 : "white")};
  transition: background-color 0.3s ease-in-out;

  :hover {
    cursor: pointer;
  }
`;
