import { useEffect } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { uiColors } from "@leafygreen-ui/palette";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { FilterInputControls } from "components/FilterInputControls";
import { tableInputContainerCSS } from "components/styles/Layout";

const { gray } = uiColors;

export const ALL_VALUE = "all";
const ALL_COPY = "All";
export interface TreeSelectProps {
  isDropdown?: boolean;
  isVisible?: boolean;
  onChange: (s: string[]) => void;
  setOptionsLabel?: (v: string) => void;
  state: string[];
  tData: TreeDataEntry[];
  onReset?: () => void;
  onFilter?: () => void;
}
export interface TreeDataChildEntry {
  title: string;
  value: string;
  key: string;
}
export interface TreeDataEntry extends TreeDataChildEntry {
  children?: TreeDataChildEntry[];
}

export const TreeSelect: React.FC<TreeSelectProps> = ({
  isDropdown = false,
  isVisible = true,
  onChange,
  setOptionsLabel = () => undefined,
  state,
  tData,
  onReset,
  onFilter,
}) => {
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

  useEffect(() => {
    setOptionsLabel(optionsLabel);
  }, [optionsLabel, setOptionsLabel]);

  if (!isVisible) {
    return null;
  }

  return (
    <ConditionalWrapper
      condition={isDropdown}
      wrapper={(children) => (
        <RelativeWrapper>
          <OptionsWrapper>{children}</OptionsWrapper>
        </RelativeWrapper>
      )}
    >
      <CheckboxContainer data-cy="tree-select-options">
        {renderCheckboxes({
          state: filteredState,
          tData,
          onChange,
        })}
        {onReset && onFilter && (
          <FilterInputControls
            onClickReset={onReset}
            onClickSubmit={onFilter}
            submitButtonCopy="Filter"
          />
        )}
      </CheckboxContainer>
    </ConditionalWrapper>
  );
};

// depth first traversal checkbox data.
// pushes parent then children to rows array
// keeps track of level for indentation
const renderCheckboxes = ({
  tData,
  state,
  onChange,
}: {
  tData: TreeDataEntry[];
  state: string[];
  onChange: (v: [string]) => void;
}): JSX.Element[] => {
  const rows: JSX.Element[] = [];
  tData.forEach((entry) => {
    renderCheckboxesHelper({ rows, data: entry, onChange, state, tData });
  });
  return rows;
};

const renderCheckboxesHelper = ({
  rows,
  data,
  onChange,
  state,
  tData,
}: {
  rows: JSX.Element[];
  data: TreeDataEntry;
  onChange: (v: string[]) => void;
  state: string[];
  tData: TreeDataEntry[];
}): void => {
  const ParentCheckboxWrapper = getCheckboxWrapper(0);
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
        data-cy="checkbox"
      />
    </ParentCheckboxWrapper>
  );
  // then examine children
  const ChildCheckboxWrapper = getCheckboxWrapper(1);
  if (data.children) {
    data.children.forEach((child) => {
      const onChangeChildFn = (): void =>
        handleOnChange({ state, value: child.value, onChange, tData });
      rows.push(
        <ChildCheckboxWrapper key={`${data.key}-${child.key}`}>
          <Checkbox
            className="cy-checkbox"
            onChange={onChangeChildFn}
            label={child.title}
            checked={state.includes(child.value)}
            bold={false}
            data-cy="checkbox"
          />
        </ChildCheckboxWrapper>
      );
    });
  }
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

const getCheckboxWrapper = (level: number): React.FC => styled.div`
  padding-left: ${level}em;
  padding-top: 4px;
  padding-bottom: 4px;
  :first-of-type {
    border-bottom: 1px solid ${gray.light2};
  }
`;

const OptionsWrapper = styled.div`
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: 100%;
`;

const CheckboxContainer = styled.div`
  ${tableInputContainerCSS}
`;

// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;
