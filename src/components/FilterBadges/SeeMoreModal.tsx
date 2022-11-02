import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { DisplayModal } from "components/DisplayModal";
import { StyledLink } from "components/styles";
import { size } from "constants/tokens";
import FilterBadge, { FilterBadgeType } from "./FilterBadge";

interface SeeMoreModalProps {
  badges: FilterBadgeType[];
  notVisibleCount: number;
  onRemoveBadge: (badge: FilterBadgeType) => void;
  onClearAll: () => void;
}
export const SeeMoreModal: React.VFC<SeeMoreModalProps> = ({
  badges,
  notVisibleCount,
  onRemoveBadge,
  onClearAll,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <LinkContainer>
        <StyledLink onClick={() => setOpen((curr) => !curr)}>
          see {notVisibleCount} more
        </StyledLink>
      </LinkContainer>
      <DisplayModal
        open={open}
        setOpen={setOpen}
        size="large"
        title="Applied Filters"
        data-cy="see-more-modal"
      >
        <BadgeContainer>
          {badges.map((b) => (
            <FilterBadge
              key={`filter_badge_${b.key}_${b.value}`}
              badge={b}
              onClose={() => onRemoveBadge(b)}
            />
          ))}
        </BadgeContainer>
        <Button
          variant={Variant.Default}
          size={Size.XSmall}
          onClick={onClearAll}
        >
          Clear all filters
        </Button>
      </DisplayModal>
    </>
  );
};

const BadgeContainer = styled.div`
  padding-top: ${size.xs};
`;

const LinkContainer = styled.span`
  margin-right: ${size.xs};
`;
