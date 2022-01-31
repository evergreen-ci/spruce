import { FilterBadges } from "components/FilterBadges";
import { size } from "constants/tokens";
import { TestStatus } from "types/history";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

export const TestSearch = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <HistoryTableTestSearch />
    <div style={{ paddingTop: `${size.s}px` }}>
      <FilterBadges
        queryParamsToDisplay={
          new Set([TestStatus.Failed, TestStatus.Passed, TestStatus.All])
        }
      />
    </div>
  </div>
);
