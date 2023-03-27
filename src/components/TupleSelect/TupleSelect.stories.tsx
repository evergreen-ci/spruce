import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import TupleSelect from ".";

export default {
  component: TupleSelect,
};

export const Default: StoryObj<typeof TupleSelect> = {
  render: () => (
    <>
      <TupleSelect
        options={options}
        onSubmit={action("submit")}
        validator={(v) => v !== "bad"}
        validatorErrorMessage="Invalid Input"
      />
      <Disclaimer>The word `bad` will fail validation</Disclaimer>
    </>
  ),
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
