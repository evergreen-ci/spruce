import StoryRouter from "storybook-react-router";
import { FilterBadges } from "components/FilterBadges";
import { size } from "constants/tokens";
import { TestStatus } from "types/history";
import { HistoryTableTestSearch } from "./HistoryTableTestSearch";

export default {
  component: HistoryTableTestSearch,
  title: "HistoryTableTestSearch",
  decorators: [StoryRouter()],
};

export const TestSearch = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <HistoryTableTestSearch />
    <div style={{ paddingTop: size.s }}>
      <FilterBadges
        queryParamsToDisplay={
          new Set([TestStatus.Failed, TestStatus.Passed, TestStatus.All])
        }
      />
    </div>
  </div>
);
