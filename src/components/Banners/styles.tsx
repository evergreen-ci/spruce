import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { yellow, blue, green, red } = uiColors;

type BannerProps = {
  bannerTheme: string;
};

export const Banner = styled.div`
  transition: max-height 0.3s ease-in-out;
  align-items: center;
  ${({ bannerTheme }: BannerProps) =>
    `background-color: ${
      bannerTheme
        ? bannerTypeToColor[bannerTheme]
        : bannerTypeToColor.announcement
    }`};
  display: flex;
  justify-content: space-between;
  padding: 5px 15px;
  margin-bottom: 15px;
`;

export const BannerPadding = styled.div`
  margin-bottom: 16px;
`;

export const bannerTypeToColor = {
  announcement: green.light2,
  information: blue.light2,
  warning: yellow.light2,
  important: red.light2,
};
