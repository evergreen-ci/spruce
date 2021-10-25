import { FilterBadges } from "components/FilterBadges";
import { TestSearch } from "./TestSearch";

export const TestFilterSearch = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <TestSearch />
    <div style={{ paddingTop: "16px" }}>
      <FilterBadges queryParamsToIgnore={new Set([])} />
    </div>
  </div>
);
