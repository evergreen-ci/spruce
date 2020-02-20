import styled from "@emotion/styled/macro";
import { Layout } from "antd";
import { css } from "@emotion/core";

const { Content, Sider } = Layout;

const whiteBackground = css`
  background: white;
  background-color: white;
`;

export const PageContent = styled(Content)`
  ${whiteBackground}
  margin-left: 16px;
  min-height: 280;
`;

export const PageLayout = styled(Layout)`
  ${whiteBackground}
`;

const siderWidth = "275px";

export const PageSider = styled(Sider)`
  ${whiteBackground}
  width: ${siderWidth} !important;
  max-width: ${siderWidth} !important;
  min-width: ${siderWidth} !important;
`;
