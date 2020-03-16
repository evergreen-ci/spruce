import React, { Children } from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const handleOnChange = ({ state, value, onChange }) => {
  state.includes(value)
    ? onChange(state.filter(v => v != value))
    : onChange([...state, value]);
};

export const StatusSelect = ({ state, tData, onChange }) => {
  return (
    <OptionsWrapper>
      {renderCheckboxes({ state, tData, onChange })}
    </OptionsWrapper>
  );
};

const renderCheckboxes = ({
  tData,
  state,
  onChange
}: {
  tData: [TreeDataEntry];
  state: [string];
  onChange: ([string]) => void;
}) => {
  const rows: JSX.Element[] = [];
  let level = 0;
  tData.forEach(entry => {
    crawl({ rows, data: entry, onChange, state }, level);
  });
  return rows;
};

const crawl = (
  {
    rows,
    data,
    onChange,
    state
  }: {
    rows: JSX.Element[];
    data: TreeDataEntry;
    onChange: (v: [string]) => void;
    state: [string];
  },
  level: number
) => {
  const Wrapper = getCheckboxWrapper(level);
  rows.push(
    <Wrapper>
      <Checkbox
        key={data.key}
        className="cy-checkbox"
        onChange={() => handleOnChange({ state, value: data.value, onChange })}
        label={data.title}
        checked={state.includes(data.value)}
        bold={false}
      />
    </Wrapper>
  );
  if (data.children) {
    data.children.forEach(entry => {
      crawl({ rows, data: entry, onChange, state }, level + 1);
    });
  }
};

interface TreeDataEntry {
  title: string;
  value: string;
  key: string;
  children?: [TreeDataEntry];
}

const getCheckboxWrapper = (level: number) => styled.div`
  padding-left: ${level}em;
`;

const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: #ffffff;
  border: 1px solid #b8c4c2;
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
`;
