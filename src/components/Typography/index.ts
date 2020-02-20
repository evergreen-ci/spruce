import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";

const { gray } = uiColors;

export const H1 = styled.h1`
  font-size: 30px;
  line-height: 36px;
  margin-bottom: 17px;
  color: ${gray.dark3};
`;

export const H2 = styled.h2`
  font-size: 18px;
  line-height: 21px;
  margin-bottom: 8px;
  color: ${gray.dark3};
`;

export const H3 = styled.h3`
  font-size: 15px;
  line-height: 17px;
  margin-bottom: 5px;
  color: ${gray.dark3};
`;

export const P1 = styled.p`
  font-size: 15px;
  line-height: 17px;
  margin-bottom: 5px;
  color: ${gray.dark3};
`;

export const P2 = styled.p`
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 13px;
  color: ${gray.dark3};
`;
