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
  inputLabel // label for the select
}: Props) => {
  const wrapperRef = useRef(null);
  const [isVisible, setisVisible] = useState<boolean>(false);
  useOnClickOutside(wrapperRef, () => setisVisible(false));
  const toggleOptions = () => setisVisible(!isVisible);
  const allValues = getAllValues(tData);
  // remove extraneous values
  const filteredState = state.filter(value => allValues.includes(value));
  const optionsLabel = filteredState.includes("all")
    ? "All"
    : filteredState
        .reduce(
          // remove children nodes if parent exists in state
          (accum, value) => {
            const { target } = findNode({ value, tData });
            if (target.children) {
              return accum.filter(
                value => !target.children.find(child => child.value === value)
              );
            }
            return accum;
          },
          [...state]
        )
        .join(", ");

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
          {renderCheckboxes({ state: filteredState, tData, onChange })}
        </OptionsWrapper>
      )}
    </Wrapper>
  );
};

// Executes when checkbox is clicked
const handleOnChange = ({
  state,
  value,
  onChange, // callback function
  tData
}: {
  state: string[];
  value: string;
  onChange: (v: string[]) => void;
  tData: TreeDataEntry[];
}) => {
  const isAlreadyChecked = state.includes(value); // is checkbox already selected
  const { target, parent, siblings } = findNode({ value, tData });
  const isParent = target.children;
  const isAll = target.value == "all"; // is all button clicked
  if (!target) {
    onChange([...state]);
  }
  // is all button checked
  if (isAll) {
    if (isAlreadyChecked) {
      onChange([]);
    } else {
      onChange(getAllValues(tData));
    }
  } else if (isParent) {
    // has list of children
    const childrenValues = target.children.map(child => child.value);
    if (isAlreadyChecked) {
      onChange(
        adjustAll({
          resultState: state.filter(
            v => v !== value && !childrenValues.includes(v)
          ),
          tData
        })
      );
    } else {
      const resultState = Array.from(
        new Set([...state, value, ...childrenValues])
      );
      onChange(adjustAll({ resultState, tData }));
    }
  } else {
    // does not have list of children, could be child
    const parentValue = parent ? parent.value : "";
    if (isAlreadyChecked) {
      onChange(
        adjustAll({
          resultState: state.filter(v => v !== value && v !== parentValue),
          tData
        })
      );
    } else {
      const shouldCheckParent =
        parentValue &&
        siblings.reduce(
          (accum, sibling) => accum && state.includes(sibling.value),
          true
        );
      // use set in case parent.value already exists in state
      const resultState = Array.from(
        new Set(
          [...state, value].concat(shouldCheckParent ? [parentValue] : [])
        )
      );
      onChange(adjustAll({ resultState, tData }));
    }
  }
};

// selects or deselects the All checkbox depending on current options
const adjustAll = ({
  resultState,
  tData
}: {
  resultState: string[];
  tData: TreeDataEntry[];
}) => {
  const allValues = getAllValues(tData).filter(value => value !== "all");
  const resultStateHasAllValues = allValues.reduce(
    (accum, value) => accum && resultState.includes(value),
    true
  );
  // convert to set in case all exists in URL when its not supposed to
  const resultStateSet = new Set(resultState);
  if (resultStateHasAllValues) {
    resultStateSet.add("all");
  } else {
    resultStateSet.delete("all");
  }
  return Array.from(resultStateSet);
};

interface FindNodeResult {
  target: TreeDataEntry;
  parent: TreeDataEntry;
  siblings: TreeDataEntry[];
}

const findNode = ({
  value,
  tData
}: {
  value: string;
  tData: TreeDataEntry[];
}): FindNodeResult => {
  for (let i = 0; i < tData.length; i++) {
    const curr = tData[i];
    if (curr.value === value) {
      return {
        target: curr,
        parent: null,
        siblings: tData.filter(v => v.value !== value)
      };
    }
    if (curr.children) {
      const child = curr.children.find(child => child.value === value);
      if (child) {
        return {
          target: child,
          parent: curr,
          siblings: curr.children.filter(child => child.value !== value)
        };
      }
    }
  }
  return {
    target: null,
    parent: null,
    siblings: []
  };
};

// returns all values in tData from parents and children
const getAllValues = (tData: TreeDataEntry[]): string[] => {
  return tData.reduce((accum, currNode) => {
    const childrenValues = currNode.children
      ? currNode.children.map(child => child.value)
      : [];
    return accum.concat([currNode.value]).concat(childrenValues);
  }, []);
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
  tData.forEach(entry => {
    crawlChildren({ rows, data: entry, onChange, state, tData }, 0);
  });
  return rows;
};
const crawlChildren = (
  {
    rows,
    data,
    onChange,
    state,
    tData
  }: {
    rows: JSX.Element[];
    data: TreeDataEntry;
    onChange: (v: string[]) => void;
    state: string[];
    tData: TreeDataEntry[];
  },
  level: number
) => {
  const CheckboxWrapper = getCheckboxWrapper(level);
  // push parent
  rows.push(
    <CheckboxWrapper key={data.key}>
      <Checkbox
        className="cy-checkbox"
        onChange={() =>
          handleOnChange({ state, value: data.value, onChange, tData })
        }
        label={data.title}
        checked={state.includes(data.value)}
        bold={false}
      />
    </CheckboxWrapper>
  );
  // then examine children
  if (data.children) {
    data.children.forEach(entry => {
      crawlChildren({ rows, data: entry, onChange, state, tData }, level + 1);
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
