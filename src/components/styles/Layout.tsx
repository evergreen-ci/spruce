import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H2, Body } from "@leafygreen-ui/typography";
import { Layout } from "antd";

const { gray, white, red } = uiColors;
const { Content, Sider } = Layout;

const whiteBackground = css`
  background: ${white};
  background-color: ${white};
`;

export const tableInputContainerCSS = css`
  ${whiteBackground}
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  overflow: hidden;
`;
export const PageContent = styled(Content)`
  ${whiteBackground}
  margin-left: 16px;
  min-height: 280;
  overflow: hidden;
`;

export const PageLayout = styled(Layout)`
  ${whiteBackground}
`;

export const PageSider = styled(Sider)`
  ${whiteBackground}
`;

PageSider.defaultProps = { width: 275 };

// @ts-expect-error
export const PageTitle = styled(H2)`
  margin-bottom: 16px;
` as typeof H2;

export const TableContainer = styled.div`
  ${(props: { hide?: boolean }): string => props.hide && "display:none;"}
`;

export const TableControlInnerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableControlOuterRow = styled(TableControlInnerRow)`
  padding-bottom: 8px;
`;

export const PageButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 350px;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

export const ErrorMessage = styled(Body)`
  color: ${red.base};
`;

export const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 24px;
`;
