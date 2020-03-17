import React, { useState, useRef } from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import Icon from "@leafygreen-ui/icon";

interface Props {
  state: string[];
  tData: TreeDataEntry[];
  onChange: (v: string[]) => void;
  inputLabel: string;
  optionsLabel: string;
}

export interface TreeDataEntry {
  title: string;
  value: string;
  key: string;
  children?: TreeDataEntry[];
}

export const TreeSelect = ({
  state,
  tData,
  onChange,
  inputLabel, // label for the select
  optionsLabel // describes selected options
}: Props) => {
  const wrapperRef = useRef(null);
  const [isVisible, setisVisible] = useState<boolean>(false);
  useOnClickOutside(wrapperRef, () => setisVisible(false));
  const toggleOptions = () => setisVisible(!isVisible);
  return (
    <Wrapper ref={wrapperRef}>
      <BarWrapper onClick={toggleOptions}>
        <LabelWrapper>
          {inputLabel}
          {optionsLabel}
        </LabelWrapper>
        <ArrowWrapper>
          <div>
            <Icon glyph={isVisible ? "ChevronUp" : "ChevronDown"} />
          </div>
        </ArrowWrapper>
      </BarWrapper>
      {isVisible && (
        <OptionsWrapper>
          {renderCheckboxes({ state, tData, onChange })}
        </OptionsWrapper>
      )}
    </Wrapper>
  );
};

// Executes when checkbox is clicked
const handleOnChange = ({
  state,
  value,
  onChange // callback function
}: {
  state: string[];
  value: string;
  onChange: (v: string[]) => void;
}) => {
  state.includes(value)
    ? onChange(state.filter(v => v !== value))
    : onChange([...state, value]);
};

// depth first traversal checkbox data.
// pushes parent then children to rows array
// keeps track of level for indentation
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
    crawlChildren({ rows, data: entry, onChange, state }, level);
  });
  return rows;
};

const crawlChildren = (
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
  const CheckboxWrapper = getCheckboxWrapper(level);
  // push parent
  rows.push(
    <CheckboxWrapper key={data.key}>
      <Checkbox
        className="cy-checkbox"
        onChange={() => handleOnChange({ state, value: data.value, onChange })}
        label={data.title}
        checked={state.includes(data.value)}
        bold={false}
      />
    </CheckboxWrapper>
  );
  // then examine children
  if (data.children) {
    data.children.forEach(entry => {
      crawlChildren({ rows, data: entry, onChange, state }, level + 1);
    });
  }
};

// styles
const getCheckboxWrapper = (level: number) => styled.div`
  padding-left: ${level}em;
  padding-bottom: 8px;
`;
const LabelWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 330px;
`;
const BarWrapper = styled.div`
  border: 1px solid ${uiColors.gray.light1};
  border-radius: 3px;
  padding: 8px;
  width: 352px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
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

const ArrowWrapper = styled.span`
  border-left: 1px solid ${uiColors.gray.light1};
  padding-left: 5px;
  > div {
    position: relative;
    top: 2px;
  }
`;

const Wrapper = styled.div`
  width: 352px;
`;
