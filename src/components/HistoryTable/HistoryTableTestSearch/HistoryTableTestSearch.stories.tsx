import { FilterBadges } from "components/FilterBadges";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

export const TestSearch = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <HistoryTableTestSearch />
    <div style={{ paddingTop: "16px" }}>
      <FilterBadges queryParamsToIgnore={new Set([])} />
    </div>
  </div>
);
