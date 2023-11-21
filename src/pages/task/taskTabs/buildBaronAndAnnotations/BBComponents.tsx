import styled from "@emotion/styled";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

export const TicketsTitle = styled(Subtitle)<
  SubtitleProps & { margin?: boolean }
>`
  margin-bottom: ${(props) => (props.margin ? size.s : size.xxs)};
  margin-top: ${(props) => (props.margin ? size.m : size.l)};
  line-height: ${size.m};
  font-weight: bold;
`;

export const ButtonWrapper = styled.div`
  margin-right: ${size.xs};
  padding-top: ${size.s};
  width: fit-content;
`;
