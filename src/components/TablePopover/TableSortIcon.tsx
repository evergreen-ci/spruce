import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { blue, gray } = palette;

enum SortState {
  ASC = "asc",
  DESC = "desc",
  OFF = "false",
}

type SortStateType = (typeof SortState)[keyof typeof SortState];

const iconGlyph = {
  [SortState.ASC]: "SortAscending",
  [SortState.DESC]: "SortDescending",
  [SortState.OFF]: "Unsorted",
};

interface TableSortIconProps {
  value: SortStateType;
  onToggle: (value: string) => void;
  "data-cy"?: string;
}

export const TableSortIcon: React.VFC<TableSortIconProps> = ({
  "data-cy": dataCy,
  onToggle,
  value,
}) => {
  const iconColor = value !== SortState.OFF ? blue.base : gray.dark2;

  const onClick = () => {
    let update: string | undefined;
    if (value === SortState.OFF) {
      update = "DESC";
    } else if (value === SortState.DESC) {
      update = "ASC";
    } else {
      update = undefined;
    }
    onToggle(update);
  };

  return (
    <Wrapper>
      <IconButton
        onClick={onClick}
        data-cy={dataCy}
        aria-label="Table Sort Icon"
      >
        <Icon glyph={iconGlyph[value]} small="xsmall" color={iconColor} />
      </IconButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: ${size.xxs};
`;
