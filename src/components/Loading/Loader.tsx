import React from "react";
import styled from "@emotion/styled/macro";
import { Spin } from "antd";

const SpinWrapper = styled.div`
  textAlign: "center",
  paddingTop: 40,
  paddingBottom: 40,
  border: "1px solid #e8e8e8",
`;

export const loader = (
  <SpinWrapper>
    <Spin tip="Loading..." />
  </SpinWrapper>
);
