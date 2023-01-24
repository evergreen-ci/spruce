import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "@storybook/addon-actions";
import { ProjectFilterOptions } from "types/commits";
import TupleSelectWithRegexConditional from ".";

export default {
  title: "Pages/Commits/TupleSelectWithRegexConditional",
  component: TupleSelectWithRegexConditional,
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
    <TupleSelectWithRegexConditional
      options={options}
      onSubmit={action("submit")}
      validator={(v) => v !== "bad"}
      validatorErrorMessage="Invalid Input"
    />
    <Disclaimer>The word `bad` will fail validation</Disclaimer>
  </div>
);
