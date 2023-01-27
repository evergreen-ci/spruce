import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "@storybook/addon-actions";
import TupleSelectWithRegexConditional from ".";

export default {
  title: "Components/TupleSelect",
  component: TupleSelectWithRegexConditional,
};

const options = [
  {
    value: "build_variant",
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: "task",
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];

export const TupleSelectWithConditional = () => (
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
