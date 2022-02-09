import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { H2, Body } from "@leafygreen-ui/typography";
import { Layout } from "antd";
import { size, fontSize } from "constants/tokens";

const { gray, white, red } = uiColors;
const { Content, Sider } = Layout;

const whiteBackground = css`
  background: ${white};
  background-color: ${white};
`;

export const PageWrapper = styled.div`
  grid-area: contents;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: ${size.m} ${size.l};
`;

export const PageGrid = styled.section`
  display: grid;
  grid-template-areas:
    "header header"
    "sidenav contents";
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

/* Flexbox-based antd components to be used together */
export const PageLayout = styled(Layout)`
  ${whiteBackground}
`;
export const PageSider = styled(Sider)`
  ${whiteBackground}
`;
export const PageContent = styled(Content)`
  margin-left: ${size.s};
  overflow: hidden;
`;

PageSider.defaultProps = { width: 275 };

// @ts-expect-error
export const PageTitle = styled(H2)`
  margin-bottom: ${size.s};
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
  padding-bottom: ${size.xs};
`;

export const PageButtonRow = styled.div`
  display: flex;
  align-items: flex-start;
  > * {
    margin-right: ${size.s};
    white-space: nowrap;
  }
  > *:last-child {
    margin-right: 0;
  }
`;

export const InputLabel = styled.label`
  font-size: ${fontSize.m};
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
  margin-top: ${size.m};
  margin-bottom: ${size.m};
`;
