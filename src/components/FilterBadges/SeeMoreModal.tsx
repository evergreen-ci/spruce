import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import Modal from "@leafygreen-ui/modal";
import { Link, H3 } from "@leafygreen-ui/typography";
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
      <Modal open={open} setOpen={setOpen} size="large">
        <ContentWrapper>
          <H3>Applied Filters</H3>
          <BadgeContainer>
            {badges.map((b) => (
              <FilterBadge
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
        </ContentWrapper>
      </Modal>
    </>
  );
};
const ContentWrapper = styled.div``;

const BadgeContainer = styled.div`
  padding-top: 8px;
`;
