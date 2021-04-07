import { withQuery } from "@storybook/addon-queryparams";
import { MemoryRouter } from "react-router-dom";
import { ProjectFilterOptions } from "types/commits";
import { TupleSelect } from ".";

export default {
  title: "TupleSelect",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
    withQuery,
  ],
};

const options = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Test,
    displayName: "Test",
    placeHolderText: "Search Test names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
export const waterfall = () => (
  <div style={{ width: "40%" }}>
    <TupleSelect options={options} />
  </div>
);
