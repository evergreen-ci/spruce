import styled from "@emotion/styled";
import { Spin } from "antd";

const SpinWrapper = styled.div`
  text-align: center,
  padding-top: 40px,
  padding-bottom: 40px,
  border: 1px solid #e8e8e8,
`;

export const loader = (
  <SpinWrapper>
    <Spin tip="Loading..." />
  </SpinWrapper>
);
