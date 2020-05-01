import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

const { green, red, yellow, blue } = uiColors;

type BannerType = "success" | "error" | "info" | "warning";
interface Props {
  type: BannerType;
}
export const Banner: React.FC<Props> = ({ children, type }) => {
  return <BannerDiv type={type}></BannerDiv>;
};

const mapTypeToBorderColor: { [type: string]: string } = {
  success: green.light2,
  error: red.light2,
  info: yellow.light2,
  warning: blue.light2,
};
const mapTypeToBackgroundColor: { [type: string]: string } = {
  success: green.light3,
  error: red.light3,
  info: yellow.light3,
  warning: blue.light3,
};
const mapTypeToTextColor: { [type: string]: string } = {
  success: green.dark2,
  error: red.dark2,
  info: yellow.dark2,
  warning: blue.dark2,
};

const BannerDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  min-height: 44px;
  border-color: ${({ type }: Props) => mapTypeToBorderColor[type]};
  background-color: ${({ type }: Props) => mapTypeToBackgroundColor[type]};
  color: ${({ type }: Props) => mapTypeToTextColor[type]};
`;
