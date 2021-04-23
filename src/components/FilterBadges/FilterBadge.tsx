import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/Icon";

const { gray } = uiColors;

interface FilterBadgeProps {
  badge: {
    key: string;
    value: string;
  };
  onClose: () => void;
}
export const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => (
  <PaddedBadge key={`filter_badge_${badge.key}_${badge.value}`}>
    <BadgeContent>
      {badge.key} : {badge.value}
      <ClickableIcon glyph="X" onClick={onClose} />
    </BadgeContent>
  </PaddedBadge>
);

const ClickableIcon = styled(Icon)`
  position: absolute;
  right: 2%;
  :hover {
    cursor: pointer;
    color: ${gray.light1};
  }
`;
const PaddedBadge = styled(Badge)`
  :nth-of-type {
    margin-left: 16px;
  }
  margin-right: 16px;
  margin-bottom: 21px;
  width: 260px;
`;

const BadgeContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;
