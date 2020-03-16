import React, { useState, useRef } from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { useOnClickOutside } from "hooks/useOnClickOutside";

export const TreeSelect = ({
  state,
  tData,
  onChange,
  inputLabel,
  optionsLabel
}: Props) => {
  const wrapperRef = useRef(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  useOnClickOutside(wrapperRef, () => setShowOptions(false));
  const toggleOptions = () => setShowOptions(!showOptions);
  return (
    <div ref={wrapperRef}>
      <LabelWrapper onClick={toggleOptions}>
        {inputLabel}
        {optionsLabel}
      </LabelWrapper>
      {showOptions && (
        <OptionsWrapper>
          {renderCheckboxes({ state, tData, onChange })}
        </OptionsWrapper>
      )}
    </div>
  );
};

const handleOnChange = ({ state, value, onChange }) => {
  state.includes(value)
    ? onChange(state.filter(v => v != value))
    : onChange([...state, value]);
};

interface Props {
  state: string[];
  tData: TreeDataEntry[];
  onChange: (v: string[]) => void;
  inputLabel: string;
  optionsLabel: string;
}

const renderCheckboxes = ({
  tData,
  state,
  onChange
}: {
  tData: TreeDataEntry[];
  state: string[];
  onChange: (v: [string]) => void;
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
    onChange: (v: string[]) => void;
    state: string[];
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
  children?: TreeDataEntry[];
}

const getCheckboxWrapper = (level: number) => styled.div`
  padding-left: ${level}em;
`;

const LabelWrapper = styled.div`
  width: 352px;
  border: 1px solid ${uiColors.gray.light1};
  border-radius: 3px;
  padding: 5px 8px 5px 5px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${uiColors.white};
  border: 1px solid ${uiColors.gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  width: 352px;
  margin-top: 5px;
`;
