import { css } from "@emotion/core";
import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";
import { H2, Body } from "@leafygreen-ui/typography";
import { Layout } from "antd";

const { Content, Sider } = Layout;

const whiteBackground = css`
  background: white;
  background-color: white;
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

export const PageTitle = styled(H2)`
  margin-bottom: 16px;
`;

export const TableContainer = styled.div`
  ${(props: { hide: boolean }): string => props.hide && "display:none;"}
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
  > button {
    margin-right: 24px;
    flex-shrink: 0;
  }
  display: flex;
  padding-right: 40px;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

export const ErrorMessage = styled(Body)`
  color: ${uiColors.red.base};
`;

export const HR = styled("hr")`
  background-color: ${uiColors.gray.light2};
  border: 0;
  height: 1px;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 24px;
`;
