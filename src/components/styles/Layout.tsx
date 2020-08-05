import styled from "@emotion/styled/macro";
import { Layout } from "antd";
import { css } from "@emotion/core";
import { H2 } from "@leafygreen-ui/typography";

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

// export const PageSider = styled(Sider)`
//   ${whiteBackground}
//   width: ${(props: { width?: number }): string =>
//     props.width ? `${props.width}px` : "275px"}; !important;
//   max-width: ${(props: { width?: number }): string =>
//     props.width ? `${props.width}px` : "275px"}; !important;
//   min-width: ${(props: { width?: number }): string =>
//     props.width ? `${props.width}px` : "275px"}; !important;
// `;

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
