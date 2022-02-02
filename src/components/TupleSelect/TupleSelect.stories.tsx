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
  component: TupleSelect,
};

const options = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];

export const Default = () => (
  <div style={{ width: "40%" }}>
    <TupleSelect options={options} />
  </div>
);
