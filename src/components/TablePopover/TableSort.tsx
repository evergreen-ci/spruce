import { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { blue, gray } = palette;

interface TableSortProps {
  sort: string;
  onToggle: (value: string) => void;
  "data-cy"?: string;
}

export const TableSort: React.VFC<TableSortProps> = ({
  "data-cy": dataCy,
  onToggle,
  sort: sortProps,
}) => {
  const [sort, setSort] = useState(sortProps);
  const iconColor = sort !== "" ? blue.base : gray.dark2;

  const onClick = () => {
    let update: string;
    if (sort === "") {
      update = "DESC";
    } else if (sort === "DESC") {
      update = "ASC";
    } else {
      update = "";
    }
    setSort(update);
    onToggle(update);
  };

  return (
    <Wrapper>
      <IconButton
        onClick={onClick}
        data-cy={dataCy}
        aria-label="Table Sort Icon"
      >
        <Icon glyph={iconGlyph[sort]} small="xsmall" color={iconColor} />
      </IconButton>
    </Wrapper>
  );
};

const iconGlyph = {
  ASC: "SortAscending",
  DESC: "SortDescending",
  "": "Unsorted",
};

const Wrapper = styled.div`
  margin-left: ${size.xxs};
`;
