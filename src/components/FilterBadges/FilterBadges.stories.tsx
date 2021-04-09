import { withQuery } from "@storybook/addon-queryparams";
import { MemoryRouter } from "react-router-dom";
// import { ProjectFilterOptions } from "types/commits";
import { FilterBadges } from ".";

export default {
  title: "FilterBadges",
  decorators: [
    (Story) => (
      <MemoryRouter>
        Some Story
        <Story />
      </MemoryRouter>
    ),
    withQuery,
  ],
};

export const Default = () => <FilterBadges />;

Default.parameters = {
  query: {
    mock: ["Hello world!", "something"],
  },
};
