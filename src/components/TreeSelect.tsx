import React, { useState, useRef, useEffect } from "react";
import Checkbox from "@leafygreen-ui/checkbox";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import Icon from "@leafygreen-ui/icon";
import { usePrevious } from "hooks";

const { gray, white } = uiColors;

const ALL_VALUE = "all";
const ALL_COPY = "All";
interface Props {
  state: string[];
  tData: TreeDataEntry[];
  onChange: (v: string[]) => void;
  inputLabel: string;
  dataCy: string;
  width?: string;
}
export interface TreeDataChildEntry {
  title: string;
  value: string;
  key: string;
}
export interface TreeDataEntry extends TreeDataChildEntry {
  children?: TreeDataChildEntry[];
}

// including a TreeDataEntry with value = "all"
// will serve as the 'All' button
export const TreeSelect: React.FC<Props> = ({
  state,
  tData,
  onChange,
  inputLabel, // label for the select
  dataCy, // for testing only
  width,
}) => {
  const wrapperRef = useRef(null);
  const prevWrapperRef = usePrevious(wrapperRef);
  const [optionWidth, setOptionWidth] = useState(0);

  useEffect(() => {
    if (wrapperRef) {
      const handleResize: () => void = () => {
        setOptionWidth(wrapperRef.current.clientWidth);
      };
      setOptionWidth(wrapperRef.current.clientWidth);
      window.addEventListener("resize", handleResize);
      return (): void => window.removeEventListener("resize", handleResize);
    }
  }, [setOptionWidth, prevWrapperRef]);

  const [isVisible, setisVisible] = useState<boolean>(false);
  useOnClickOutside(wrapperRef, () => setisVisible(false));
  const toggleOptions: () => void = () => setisVisible(!isVisible);
  const allValues = getAllValues(tData);
  // removes values not included in tData
  const filteredState = state.filter((value) => allValues.includes(value));
  const optionsLabel = filteredState.includes(ALL_VALUE)
    ? ALL_COPY
    : filteredState
        .reduce(
          // remove children nodes if parent exists in state
          (accum, value) => {
            const { target } = findNode({ value, tData });
            if (target.children) {
              return accum.filter(
                (v) => !target.children.find((child) => child.value === v)
              );
            }
            return accum;
          },
          [...filteredState]
        )
        .map((value) => findNode({ value, tData }).target.title)
        .join(", ");

  return (
    <Wrapper data-cy={dataCy} ref={wrapperRef} width={width}>
      <BarWrapper onClick={toggleOptions} className="cy-treeselect-bar">
        <LabelWrapper>
          {inputLabel}
          {optionsLabel || "No filters selected"}
        </LabelWrapper>
        <ArrowWrapper>
          <div>
            <Icon glyph={isVisible ? "ChevronUp" : "ChevronDown"} />
          </div>
        </ArrowWrapper>
      </BarWrapper>
      {isVisible && (
        <OptionsWrapper width={optionWidth}>
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
  tData,
}: {
  state: string[];
  value: string;
  onChange: (v: string[]) => void;
  tData: TreeDataEntry[];
}): void => {
  const isAlreadyChecked = state.includes(value); // is checkbox already selected
  const { target, parent, siblings } = findNode({ value, tData });
  const isParent = target.children;
  const isAll = target.value === ALL_VALUE; // is all button clicked
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
    const childrenValues = target.children.map((child) => child.value);
    if (isAlreadyChecked) {
      onChange(
        adjustAll({
          resultState: state.filter(
            (v) => v !== value && !childrenValues.includes(v)
          ),
          tData,
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
          resultState: state.filter((v) => v !== value && v !== parentValue),
          tData,
        })
      );
    } else {
      let siblingsChecked = true;
      siblings.forEach((sibling) => {
        siblingsChecked = siblingsChecked && state.includes(sibling.value);
      });
      const shouldCheckParent = parentValue && siblingsChecked;
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
  tData,
}: {
  resultState: string[];
  tData: TreeDataEntry[];
}): string[] => {
  const allValues = getAllValues(tData).filter((value) => value !== ALL_VALUE);
  const resultStateHasAllValues = allValues.reduce(
    (accum, value) => accum && resultState.includes(value),
    true
  );
  // convert to set in case all exists in URL when its not supposed to
  const resultStateSet = new Set(resultState);
  if (resultStateHasAllValues) {
    resultStateSet.add(ALL_VALUE);
  } else {
    resultStateSet.delete(ALL_VALUE);
  }
  return Array.from(resultStateSet);
};

interface FindNodeResult {
  target: TreeDataEntry;
  parent: TreeDataEntry;
  siblings: TreeDataEntry[] | TreeDataChildEntry[];
}

const findNode = ({
  value,
  tData,
}: {
  value: string;
  tData: TreeDataEntry[];
}): FindNodeResult => {
  // eslint-disable-next-line no-restricted-syntax
  for (const curr of tData) {
    if (curr.value === value) {
      return {
        target: curr,
        parent: null,
        siblings: tData.filter((v) => v.value !== value),
      };
    }
    if (curr.children) {
      const child = curr.children.find((c) => c.value === value);
      if (child) {
        return {
          target: child,
          parent: curr,
          siblings: curr.children.filter((c) => c.value !== value),
        };
      }
    }
  }
  return {
    target: null,
    parent: null,
    siblings: [],
  };
};

// returns all values in tData from parents and children
const getAllValues = (tData: TreeDataEntry[]): string[] =>
  tData.reduce((accum, currNode) => {
    const childrenValues = currNode.children
      ? currNode.children.map((child) => child.value)
      : [];
    return accum.concat([currNode.value]).concat(childrenValues);
  }, []);

// depth first traversal checkbox data.
// pushes parent then children to rows array
// keeps track of level for indentation
export const renderCheckboxes = ({
  tData,
  state,
  onChange,
  hasParent = true,
}: {
  tData: TreeDataEntry[];
  state: string[];
  onChange: (v: [string]) => void;
  hasParent?: boolean;
}): JSX.Element[] => {
  const rows: JSX.Element[] = [];
  tData.forEach((entry) => {
    renderCheckboxesHelper({
      rows,
      data: entry,
      onChange,
      state,
      tData,
      hasParent,
    });
  });
  return rows;
};

const renderCheckboxesHelper = ({
  rows,
  data,
  onChange,
  state,
  tData,
  hasParent,
}: {
  rows: JSX.Element[];
  data: TreeDataEntry;
  onChange: (v: string[]) => void;
  state: string[];
  tData: TreeDataEntry[];
  hasParent: boolean;
}): void => {
  const ParentCheckboxWrapper = getCheckboxWrapper(0, hasParent);
  // push parent
  const onChangeFn = (): void =>
    handleOnChange({ state, value: data.value, onChange, tData });
  rows.push(
    <ParentCheckboxWrapper key={data.key}>
      <Checkbox
        className="cy-checkbox"
        onChange={onChangeFn}
        label={data.title}
        checked={state.includes(data.value)}
        bold={false}
      />
    </ParentCheckboxWrapper>
  );
  // then examine children
  const ChildCheckboxWrapper = getCheckboxWrapper(1, hasParent);
  if (data.children) {
    data.children.forEach((child) => {
      const onChangeChildFn = (): void =>
        handleOnChange({ state, value: child.value, onChange, tData });
      rows.push(
        <ChildCheckboxWrapper key={child.key}>
          <Checkbox
            className="cy-checkbox"
            onChange={onChangeChildFn}
            label={child.title}
            checked={state.includes(child.value)}
            bold={false}
          />
        </ChildCheckboxWrapper>
      );
    });
  }
};

const getCheckboxWrapper = (
  level: number,
  hasParent: boolean
): React.FC => styled.div`
  padding-left: ${level}em;
  padding-top: 4px;
  padding-bottom: 4px;
  ${hasParent &&
    `
    :first-of-type {
      border-bottom: 1px solid ${gray.light2};
    }
  `}
`;
const LabelWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const BarWrapper = styled.div`
  border: 1px solid ${gray.light1};
  border-radius: 3px;
  padding: 8px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
`;
const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: ${(props: { width: number }): string =>
    props.width ? `${props.width}px` : ""};
  overflow: hidden;
`;
const ArrowWrapper = styled.span`
  border-left: 1px solid ${gray.light1};
  padding-left: 5px;
  > div {
    position: relative;
    top: 2px;
  }
`;
const Wrapper = styled.div`
  width: ${(props: { width?: string }): string =>
    props.width ? props.width : ""};
`;
