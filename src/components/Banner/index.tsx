import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "@leafygreen-ui/icon";
import { Body } from "@leafygreen-ui/typography";

const { green, red, yellow, blue, gray } = uiColors;

interface BannerType {
  success: string;
  error: string;
  info: string;
  warning: string;
}
type BannerTypeKeys = keyof BannerType;
interface Props {
  type: BannerTypeKeys;
}

export const Banner: React.FC<Props> = ({ children, type }) => {
  return (
    <Wrapper type={type}>
      <StyledBody type={type}>{children}</StyledBody>
      {(type === "success" || type === "info") && (
        <X>
          <Icon glyph="X" fill={gray.base} />
        </X>
      )}
    </Wrapper>
  );
};

const mapTypeToBorderColor: { [key in BannerTypeKeys]: string } = {
  success: green.light2,
  error: red.light2,
  warning: yellow.light2,
  info: blue.light2,
};
const mapTypeToBackgroundColor: { [key in BannerTypeKeys]: string } = {
  success: green.light3,
  error: red.light3,
  warning: yellow.light3,
  info: blue.light3,
};
const mapTypeToTextColor: { [key in BannerTypeKeys]: string } = {
  success: green.dark2,
  error: red.dark2,
  warning: yellow.dark2,
  info: blue.dark2,
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  min-height: 44px;
  border: 1px solid;
  border-radius: 4px;
  border-color: ${({ type }: Props) => mapTypeToBorderColor[type]};
  background-color: ${({ type }: Props) => mapTypeToBackgroundColor[type]};
`;
const StyledBody = styled(Body)`
  color: ${({ type }: Props) => mapTypeToTextColor[type]};
`;
const X = styled.div`
  margin-left: 16px;
  cursor: pointer;
`;
