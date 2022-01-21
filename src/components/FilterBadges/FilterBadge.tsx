import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Icon from "components/Icon";
import { string } from "utils";

const maxBadgeLength = 25;
const { trimStringFromMiddle } = string;

const { gray } = uiColors;

interface FilterBadgeProps {
  badge: {
    key: string;
    value: string;
  };
  onClose: () => void;
}
export const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => {
  const trimmedBadgeName = trimStringFromMiddle(badge.value, maxBadgeLength);

  return (
    <PaddedBadge
      key={`filter_badge_${badge.key}_${badge.value}`}
      data-cy="filter-badge"
    >
      <ConditionalWrapper
        condition={trimmedBadgeName !== badge.value}
        wrapper={(children) => (
          <StyledTooltip
            align="top"
            justify="middle"
            popoverZIndex={10 /* use tooltipIndex when it's merged */}
            trigger={children}
            triggerEvent="hover"
          >
            {badge.value}
          </StyledTooltip>
        )}
      >
        <BadgeContent>
          {badge.key} : {trimmedBadgeName}
        </BadgeContent>
      </ConditionalWrapper>

      <ClickableIcon data-cy="close-badge" glyph="X" onClick={onClose} />
    </PaddedBadge>
  );
};

const ClickableIcon = styled(Icon)`
  position: absolute;
  right: 4px;
  :hover {
    cursor: pointer;
    color: ${gray.light1};
  }
`;
const PaddedBadge = styled(Badge)`
  position: relative;
  :nth-of-type {
    margin-left: 16px;
  }
  margin-right: 16px;
  margin-bottom: 24px;
  padding: 0px 24px 0px 16px; // the difference in padding is to offset the "X" button visually
`;

const BadgeContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  padding: 4px 8px;
`;
