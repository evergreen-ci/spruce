import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { gray } = uiColors;

export const wordBreakCss = css`
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  word-break: break-word;
`;

export const WordBreak = styled.span`
  ${wordBreakCss};
`;

export const H1 = styled.h1`
  font-size: 30px;
  line-height: 36px;
  margin-bottom: 17px;
  color: ${gray.dark3};
  display: inline-flex;
`;

export const H2 = styled.h2`
  font-size: 20px;
  line-height: 23px;
  margin-bottom: 8px;
  color: ${gray.dark3};
  display: inline-flex;
`;

export const H3 = styled.h3`
  font-size: 15px;
  line-height: 17px;
  margin-bottom: 5px;
  color: ${gray.dark3};
  display: inline-flex;
`;

export const P1 = styled.p`
  font-size: 15px;
  line-height: 17px;
  margin-bottom: 5px;
  color: ${gray.dark3};
  ${wordBreakCss};
`;

export const P2 = styled.p`
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 13px;
  color: ${gray.dark3};
  ${wordBreakCss};
`;
