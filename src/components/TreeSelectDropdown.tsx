import React, { useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";

const { gray } = uiColors;

interface RenderProps {
  isVisible: boolean;
  setOptionsLabel?: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
  inputLabel: string;
  "data-cy": string;
  width?: string;
  render: ({
    getDropdownProps,
  }: {
    getDropdownProps: () => RenderProps;
  }) => JSX.Element;
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
export const TreeSelectDropdown: React.FC<Props> = ({
  inputLabel, // label for the select
  "data-cy": dataCy, // for testing only
  width,
  render,
}) => {
  const [isVisible, setisVisible] = useState(false);
  const toggleOptions: () => void = () => setisVisible(!isVisible);
  const [optionsLabel, setOptionsLabel] = useState("No filters selected");

  const getDropdownProps = () => ({
    isVisible,
    setOptionsLabel,
  });

  return (
    <Wrapper data-cy={dataCy} width={width}>
      <BarWrapper onClick={toggleOptions} className="cy-treeselect-bar">
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
      <RelativeWrapper>{render({ getDropdownProps })}</RelativeWrapper>
    </Wrapper>
  );
};

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

// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
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
