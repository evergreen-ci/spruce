import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import FilterBadge, { FilterBadgeType } from "./FilterBadge";
import { SeeMoreModal } from "./SeeMoreModal";
import useFilterBadgeQueryParams from "./useFilterBadgeQueryParams";

interface FilterBadgesProps {
  badges: FilterBadgeType[];
  onRemove?: (badge: FilterBadgeType) => void;
  onClearAll?: () => void;
}
const FilterBadges: React.FC<FilterBadgesProps> = ({
  badges,
  onClearAll = () => {},
  onRemove = () => {},
}) => {
  const handleOnRemove = (badge: FilterBadgeType) => {
    onRemove(badge);
  };

  const handleClearAll = () => {
    onClearAll();
  };
  const visibleBadges = badges.slice(0, 8);
  const notVisibleCount = badges.slice(8, badges.length).length;
  return (
    <Container>
      {visibleBadges.map((p) => (
        <FilterBadge
          key={`filter_badge_${p.key}_${p.value}`}
          badge={p}
          onClose={() => {
            handleOnRemove(p);
          }}
        />
      ))}
      {badges.length > 8 && (
        <SeeMoreModal
          badges={badges}
          notVisibleCount={notVisibleCount}
          onRemoveBadge={handleOnRemove}
          onClearAll={handleClearAll}
        />
      )}
      {badges.length > 0 && (
        <Button
          variant={Variant.Default}
          size={Size.XSmall}
          onClick={handleClearAll}
          data-cy="clear-all-filters"
        >
          CLEAR ALL FILTERS
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-height: 72px; // height of 2 rows of @leafygreen-ui/badge elements
  overflow: hidden;
`;

export default FilterBadges;
export { useFilterBadgeQueryParams };
