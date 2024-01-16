import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import Icon from "components/Icon";
import { size, zIndex } from "constants/tokens";

import { string } from "utils";

const { trimStringFromMiddle } = string;
const { gray } = palette;

const tooltipInModalZIndex = zIndex.tooltip; // necessary due to SeeMoreModal, which has zIndex 40
const maxBadgeLength = 25;

interface FilterBadgeType {
  key: string;
  value: string;
}
interface FilterBadgeProps {
  badge: FilterBadgeType;
  onClose: () => void;
}
const FilterBadge: React.FC<FilterBadgeProps> = ({ badge, onClose }) => {
  // the trimmed name needs to account for the label
  const trimmedBadgeName = trimStringFromMiddle(
    badge.value,
    maxBadgeLength - badge.key.length,
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
          {badge.key}: {trimmedBadgeName}
        </BadgeContent>
        <ClickableIcon data-cy="close-badge" glyph="X" onClick={onClose} />
      </PaddedBadge>
    </ConditionalWrapper>
  );
};

const ClickableIcon = styled(Icon)`
  position: absolute;
  right: ${size.xxs};
  :hover {
    cursor: pointer;
    color: ${gray.light1};
  }
`;

const PaddedBadge = styled(Badge)`
  :nth-of-type {
    margin-left: ${size.s};
  }
  margin-right: ${size.s};
  margin-bottom: ${size.m};
  padding-right: ${size.m};

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
  padding: ${size.xxs} ${size.xs};
`;

export default FilterBadge;
export type { FilterBadgeType };
