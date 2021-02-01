import React from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { wordBreakCss } from "components/Typography";
import { BannerTypeKeys } from "types/banner";

const { green, red, yellow, blue, gray } = uiColors;

interface Props {
  id?: string;
  type: BannerTypeKeys;
  removeBanner?: (bannerId: string) => void;
}

export const Banner: React.FC<Props> = ({
  children,
  type,
  removeBanner,
  id,
}) => {
  const onClickX = () => removeBanner(id);
  return (
    <Wrapper type={type} data-cy="banner">
      <StyledBody type={type}>{children}</StyledBody>
      {(type === "success" || type === "info") && (
        <X onClick={onClickX}>
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

interface StyleProps {
  type: BannerTypeKeys;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  border: 1px solid;
  border-radius: 4px;
  border-color: ${({ type }: StyleProps) => mapTypeToBorderColor[type]};
  background-color: ${({ type }: StyleProps) => mapTypeToBackgroundColor[type]};
`;
const StyledBody = styled(Body)`
  color: ${({ type }: StyleProps) => mapTypeToTextColor[type]};
  ${wordBreakCss}
`;
const X = styled.div`
  margin-left: 16px;
  cursor: pointer;
`;
