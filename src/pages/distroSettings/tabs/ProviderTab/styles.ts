import { css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { STANDARD_FIELD_WIDTH } from "components/SpruceForm/utils";
import { size } from "constants/tokens";

const textAreaCSS = css`
  box-sizing: border-box;
  max-width: ${STANDARD_FIELD_WIDTH}px;
  textarea {
    font-family: ${fontFamilies.code};
  }
`;

const mergeCheckboxCSS = css`
  max-width: ${STANDARD_FIELD_WIDTH}px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: -20px;
`;

const capacityCheckboxCSS = css`
  max-width: ${STANDARD_FIELD_WIDTH}px;
`;

const indentCSS = css`
  box-sizing: border-box;
  padding-left: ${size.m};
`;

export { textAreaCSS, mergeCheckboxCSS, capacityCheckboxCSS, indentCSS };
