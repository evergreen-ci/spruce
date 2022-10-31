import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { size } from "constants/tokens";
import { CardType } from "types/leafygreen";

// @ts-expect-error
export const PreferencesCard: CardType = styled(Card)`
  padding: ${size.m};

  :not(:last-of-type) {
    margin-bottom: ${size.m};
  }
`;
