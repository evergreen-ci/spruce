import styled from "@emotion/styled/macro";
import { Layout } from "antd";

const { Content, Sider } = Layout;

export const PageContent = styled(Content)`
  background: white;
  background-color: white;
  margin-left: 8px;
  min-height: 280;
`;

export const PageLayout = styled(Layout)`
  background: white;
  background-color: white;
`;

export const PageSider = styled(Sider)`
  background: white;
  background-color: white;
  width: 200px;
`;
