import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { size } from "constants/tokens";
import { CardType } from "types/leafygreen";

export const PreferencesCard = styled<CardType>(Card)`
  padding: ${size.m};

  :not(:last-of-type) {
    margin-bottom: ${size.m};
  }
`;
