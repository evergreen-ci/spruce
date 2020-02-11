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
  margin-left: 8px;
  min-height: 280;
`;

export const PageLayout = styled(Layout)`
  ${whiteBackground}
`;

export const PageSider = styled(Sider)`
  ${whiteBackground}
  width: 200px;
`;
