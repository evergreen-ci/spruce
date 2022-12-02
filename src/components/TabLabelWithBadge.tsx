import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";

interface Props {
  tabLabel: string;
  badgeText: string | number;
  badgeVariant: Variant;
  dataCyBadge?: string;
}
export const TabLabelWithBadge: React.VFC<Props> = ({
  tabLabel,
  badgeText,
  badgeVariant,
  dataCyBadge,
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
  height: 16px;
`;
