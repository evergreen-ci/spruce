import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "@storybook/addon-actions";
import TupleSelect from ".";

export default {
  title: "Components/TupleSelect",
  component: TupleSelect,
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

export const Default = () => (
  <div style={{ width: "40%" }}>
    <TupleSelect
      options={options}
      onSubmit={action("submit")}
      validator={(v) => v !== "bad"}
      validatorErrorMessage="Invalid Input"
    />
    <Disclaimer>The word `bad` will fail validation</Disclaimer>
  </div>
);
