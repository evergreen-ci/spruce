import React, { useRef, useState } from "react";
import Button from "@leafygreen-ui/button";
import { EllipsisBtnCopy } from "components/styles/Button";
import styled from "@emotion/styled";
import { useOnClickOutside } from "hooks";
import Card from "@leafygreen-ui/card";
import { InputNumber } from "antd";
import { Body } from "@leafygreen-ui/typography";

interface Props {
  priority?: number;
}
export const ActionButtons = (props: Props) => {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [priority, setPriority] = useState<number>(props.priority);
  useOnClickOutside(wrapperRef, () => setIsVisible(false));
  const toggleOptions = () => setIsVisible(!isVisible);
  const onChange = (p) => {
    setPriority(p);
  };
  return (
    <Container ref={wrapperRef}>
      <Button size="small">Schedule</Button>
      <Button size="small">Restart</Button>
      <Button size="small">Add Notification</Button>
      <div>
        <Button onClick={toggleOptions} size="small">
          <EllipsisBtnCopy>...</EllipsisBtnCopy>
        </Button>
        {isVisible && (
          <Options>
            <Item>Unschedule</Item>
            <Item>Abort</Item>
            <div>
              <Item style={{ paddingRight: 8 }}>Set priority</Item>
              <InputNumber
                size="small"
                min={1}
                type="number"
                max={100000}
                value={priority}
                onChange={onChange}
              />
            </div>
          </Options>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  > button {
    margin-right: 8px;
  }
  display: flex;
`;

const Options = styled(Card)`
  position: absolute;
  right: 8px;
  z-index: 1;
  margin-top: 2px;
  padding: 8px;
`;

const Item = styled.div`
  &:hover {
    text-decoration: underline;
  }
`;
