import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H2, H2Props, Body, BodyProps } from "@leafygreen-ui/typography";
import { Layout } from "antd";
import { size, fontSize } from "constants/tokens";

const { gray, red, white } = palette;
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

export const PageTitle = styled(H2)<H2Props>`
  margin-bottom: ${size.s};
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
  gap: ${size.xs};

  button {
    min-width: fit-content;
  }
`;

export const InputLabel = styled.label`
  font-size: ${fontSize.m};
  font-weight: bold;
  color: ${gray.dark2};
`;

export const ErrorMessage = styled(Body)<BodyProps>`
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
