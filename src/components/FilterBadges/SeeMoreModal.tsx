import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { Link } from "@leafygreen-ui/typography";
import { DisplayModal } from "components/DisplayModal";
import { size } from "constants/tokens";
import { FilterBadge } from "./FilterBadge";

interface SeeMoreModalProps {
  badges: {
    key: string;
    value: string;
  }[];
  notVisibleCount: number;
  onRemoveBadge: (key: string, value: string) => void;
  onClearAll: () => void;
}
export const SeeMoreModal: React.FC<SeeMoreModalProps> = ({
  badges,
  notVisibleCount,
  onRemoveBadge,
  onClearAll,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link onClick={() => setOpen((curr) => !curr)}>
        see {notVisibleCount} more
      </Link>
      <DisplayModal
        open={open}
        setOpen={setOpen}
        size="large"
        title="Applied Filters"
      >
        <BadgeContainer>
          {badges.map((b) => (
            <FilterBadge
              key={`filter_badge_${b.key}_${b.value}`}
              badge={b}
              onClose={() => onRemoveBadge(b.key, b.value)}
            />
          ))}
        </BadgeContainer>
        <Button
          variant={Variant.Default}
          size={Size.XSmall}
          onClick={onClearAll}
        >
          CLEAR ALL FILTERS
        </Button>
      </DisplayModal>
    </>
  );
};

const BadgeContainer = styled.div`
  padding-top: ${size.xs}px;
`;
