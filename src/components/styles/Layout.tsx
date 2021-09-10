import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H2, Body } from "@leafygreen-ui/typography";
import { Layout } from "antd";

const { gray, white, red } = uiColors;
const { Sider } = Layout;

const whiteBackground = css`
  background: ${white};
  background-color: ${white};
`;

export const PageContent = styled.main`
  margin-left: 16px;
`;

export const PageWrapper = styled.div`
  grid-area: contents;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 24px 36px 56px 36px;
`;

export const PageLayout = styled.div`
  ${whiteBackground}
  display: grid;
  grid-template-areas:
    "header header"
    "sidenav contents";
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  height: 100vh;
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
