import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import { PopoverContainer } from "components/styles/Popover";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";
import { TreeDataEntry, TreeSelect } from "../TreeSelect";

const { gray, white, focus } = uiColors;

interface TableFilterPopoverProps {
  value: string[];
  options: TreeDataEntry[];
  onConfirm: (filters: string[]) => void;
  "data-cy"?: string;
}

export const TableFilterPopover: React.VFC<TableFilterPopoverProps> = ({
  value,
  options,
  onConfirm,
  "data-cy": dataCy,
}) => {
  const [active, setActive] = useState(false);
  const iconColor = value.length ? focus : gray.dark2;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const onChange = (newFilters: string[]) => {
    onConfirm(newFilters);
  };

  return (
    <div>
      <IconWrapper
        active={active}
        onClick={() => setActive(!active)}
        data-cy={dataCy}
        ref={buttonRef}
      >
        <Icon glyph="Filter" small="xsmall" color={iconColor} />
      </IconWrapper>
      <Popover align="bottom" justify="middle" active={active}>
        <PopoverContainer ref={popoverRef}>
          <TreeSelect
            hasStyling={false}
            tData={options}
            state={value}
            onChange={onChange}
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
