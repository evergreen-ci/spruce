import { useState, useRef, useMemo } from "react";
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
  "data-cy"?: string;
  onConfirm: (filters: string[]) => void;
  options: TreeDataEntry[];
  value: string[];
}

export const TableFilterPopover: React.FC<TableFilterPopoverProps> = ({
  "data-cy": dataCy,
  onConfirm,
  options,
  value,
}) => {
  const [active, setActive] = useState(false);
  const iconColor = value.length ? blue.base : gray.dark2;

  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  const onChange = (newFilters: string[]) => {
    onConfirm(newFilters);
  };

  const valueAsArray = useMemo(
    () => (Array.isArray(value) ? value : [value]),
    [value],
  );

  return (
    <FilterWrapper>
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
        <PopoverContainer ref={popoverRef} data-cy={`${dataCy}-wrapper`}>
          <TreeSelect
            hasStyling={false}
            tData={options}
            state={valueAsArray}
            onChange={onChange}
          />
        </PopoverContainer>
      </Popover>
    </FilterWrapper>
  );
};

const FilterWrapper = styled.div`
  margin-left: ${size.xxs};
`;
