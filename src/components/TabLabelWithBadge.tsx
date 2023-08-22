import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { size } from "constants/tokens";

interface Props {
  tabLabel: string;
  badgeText: string | number;
  badgeVariant: Variant;
  dataCyBadge?: string;
}
export const TabLabelWithBadge: React.FC<Props> = ({
  badgeText,
  badgeVariant,
  dataCyBadge,
  tabLabel,
}) => (
  <>
    {tabLabel}{" "}
    <StyledBadge data-cy={dataCyBadge} variant={badgeVariant}>
      {badgeText}
    </StyledBadge>
  </>
);

const StyledBadge = styled(Badge)`
  // Fix height to be consistent with text-only tabs
  height: ${size.s};
`;
