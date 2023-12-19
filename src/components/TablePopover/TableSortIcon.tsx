import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";
import { SortDirection } from "gql/generated/types";

const { blue, gray } = palette;

enum TableSortState {
  ASC = "asc",
  DESC = "desc",
  OFF = "false",
}

type SortStateType = (typeof TableSortState)[keyof typeof TableSortState];

const iconGlyph = {
  [TableSortState.ASC]: "SortAscending",
  [TableSortState.DESC]: "SortDescending",
  [TableSortState.OFF]: "Unsorted",
};

interface TableSortIconProps {
  "data-cy"?: string;
  onToggle: (value: string) => void;
  value: SortStateType;
}

export const TableSortIcon: React.FC<TableSortIconProps> = ({
  "data-cy": dataCy,
  onToggle,
  value,
}) => {
  const iconColor = value === TableSortState.OFF ? gray.dark2 : blue.base;

  const onClick = () => {
    let update: string | undefined;
    if (value === TableSortState.OFF) {
      update = SortDirection.Asc;
    } else if (value === TableSortState.ASC) {
      update = SortDirection.Desc;
    } else {
      update = undefined;
    }
    onToggle(update);
  };

  return (
    <SortIconWrapper>
      <IconButton
        aria-label="Table Sort Icon"
        data-cy={dataCy}
        onClick={onClick}
      >
        <Icon color={iconColor} glyph={iconGlyph[value]} small="xsmall" />
      </IconButton>
    </SortIconWrapper>
  );
};

const SortIconWrapper = styled.div`
  margin-left: ${size.xxs};
`;
