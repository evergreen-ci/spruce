import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Icon from "components/Icon";
import { size } from "constants/tokens";

import { string } from "utils";

const { trimStringFromMiddle } = string;
const { gray } = uiColors;

const tooltipInModalZIndex = 50; // necessary due to SeeMoreModal, which has zIndex 40
const maxBadgeLength = 25;

interface FilterBadgeProps {
  badge: {
    key: string;
    value: string;
  };
  onClose: () => void;
}
export const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => {
  // the trimmed name needs to account for the label
  const trimmedBadgeName = trimStringFromMiddle(
    badge.value,
    maxBadgeLength - badge.key.length
  );

  return (
    <ConditionalWrapper
      condition={trimmedBadgeName !== badge.value}
      wrapper={(children) => (
        <StyledTooltip
          align="top"
          justify="middle"
          popoverZIndex={tooltipInModalZIndex}
          trigger={children}
          triggerEvent="hover"
        >
          {badge.value}
        </StyledTooltip>
      )}
    >
      <PaddedBadge
        key={`filter_badge_${badge.key}_${badge.value}`}
        data-cy="filter-badge"
      >
        <BadgeContent>
          {badge.key} : {trimmedBadgeName}
        </BadgeContent>
        <ClickableIcon data-cy="close-badge" glyph="X" onClick={onClose} />
      </PaddedBadge>
    </ConditionalWrapper>
  );
};

const ClickableIcon = styled(Icon)`
  position: absolute;
  right: ${size.xxs}px;
  :hover {
    cursor: pointer;
    color: ${gray.light1};
  }
`;
const PaddedBadge = styled(Badge)`
  :nth-of-type {
    margin-left: ${size.s}px;
  }
  margin-right: ${size.s}px;
  margin-bottom: ${size.m}px;
  width: 260px;

  position: relative;
  :hover {
    cursor: default;
  }
`;

const BadgeContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// @ts-expect-error
// Reduce Tooltip padding because the default Tooltip is invasive when trying to interact with other UI elements
const StyledTooltip = styled(Tooltip)`
  padding: ${size.xxs}px ${size.xs}px;
`;
