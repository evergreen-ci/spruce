import styled from "@emotion/styled";
import { H2 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

export const Title = H2;

export const TitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${size.s};
`;

export const BadgeWrapper = styled.div`
  display: flex;
  gap: ${size.xs};
`;

export const DoesNotExpire = "Does not expire";

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Section = styled(ModalContent)`
  margin-top: 20px;
`;
