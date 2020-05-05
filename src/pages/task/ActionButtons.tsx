import React, { useRef, useState } from "react";
import { Button } from "components/Button";
import { EllipsisBtnCopy } from "components/styles/Button";
import styled from "@emotion/styled";
import { useOnClickOutside } from "hooks";
import Card from "@leafygreen-ui/card";
import { InputNumber, Popconfirm } from "antd";
import get from "lodash/get";
import { Body } from "@leafygreen-ui/typography";

interface Props {
  priority?: number;
}

export const ActionButtons = (props: Props) => {
  const wrapperRef = useRef(null);
  const priorityRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [priority, setPriority] = useState<number>(props.priority);
  const outsideClickCb = () => {
    if (
      !get(priorityRef, "current.className", "").includes("ant-popover-open")
    ) {
      setIsVisible(false);
    }
  };
  useOnClickOutside(wrapperRef, outsideClickCb);
  const toggleOptions = () => setIsVisible(!isVisible);
  const onChange = (p) => {
    setPriority(p);
  };

  return (
    <Container ref={wrapperRef}>
      <Button>Schedule</Button>
      <Button>Restart</Button>
      <Button>Add Notification</Button>
      <div>
        <Button onClick={toggleOptions}>
          <EllipsisBtnCopy>...</EllipsisBtnCopy>
        </Button>
        {isVisible && (
          <Options>
            <Item>
              <Body>Unschedule</Body>
            </Item>
            <Item>
              <Body>Abort</Body>
            </Item>
            <div>
              <Popconfirm
                placement="left"
                title={
                  <>
                    <Body>Submit priority:</Body>
                    <div>
                      <InputNumber
                        size="small"
                        min={1}
                        type="number"
                        max={100000}
                        value={priority}
                        onChange={onChange}
                      />
                    </div>
                  </>
                }
                onConfirm={() => console.log("confirm")}
                onCancel={() => console.log("cancel")}
                okText="Yes"
                cancelText="No"
              >
                <Item ref={priorityRef} style={{ paddingRight: 8 }}>
                  <Body>Set priority</Body>
                </Item>
              </Popconfirm>
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
  > p:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;
