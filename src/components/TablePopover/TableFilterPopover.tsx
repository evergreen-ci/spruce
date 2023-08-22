import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import { PopoverContainer } from "components/styles/Popover";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";
import { TreeDataEntry, TreeSelect } from "../TreeSelect";

const { blue, gray } = palette;

interface TableFilterPopoverProps {
  value: string[];
  options: TreeDataEntry[];
  onConfirm: (filters: string[]) => void;
  "data-cy"?: string;
}

export const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  "data-cy": dataCy,
  onConfirm,
  options,
  value,
}) => {
  const [active, setActive] = useState(false);
  const iconColor = value.length ? blue.light1 : gray.dark2;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const onChange = (newFilters: string[]) => {
    onConfirm(newFilters);
  };

  return (
    <Wrapper>
      <IconButton
        onClick={() => setActive(!active)}
        active={active}
        data-cy={dataCy}
        aria-label="Table Filter Popover Icon"
        ref={buttonRef}
      >
        <Icon glyph="Filter" small="xsmall" color={iconColor} />
      </IconButton>
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: ${size.xxs};
`;
