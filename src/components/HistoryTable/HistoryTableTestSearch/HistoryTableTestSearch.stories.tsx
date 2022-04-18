import FilterBadges from "components/FilterBadges";
import { size } from "constants/tokens";
import { useFilterBadgeQueryParams } from "hooks";
import { TestStatus } from "types/history";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

export default {
  title: "HistoryTableTestSearch",
  component: HistoryTableTestSearch,
};

export const TestSearch = () => {
  const { badges, handleClearAll, handleOnRemove } = useFilterBadgeQueryParams(
    new Set([TestStatus.Failed, TestStatus.Passed, TestStatus.All])
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <HistoryTableTestSearch />
      <div style={{ paddingTop: size.s }}>
        <FilterBadges
          badges={badges}
          onRemove={handleOnRemove}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  );
};
