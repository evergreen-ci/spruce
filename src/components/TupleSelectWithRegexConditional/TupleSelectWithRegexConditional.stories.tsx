import { Disclaimer } from "@leafygreen-ui/typography";
import { action } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import TupleSelectWithRegexConditional from ".";

export default {
  component: TupleSelectWithRegexConditional,
  title: "Components/TupleSelect",
} satisfies CustomMeta<typeof TupleSelectWithRegexConditional>;

export const WithConditional: CustomStoryObj<
  typeof TupleSelectWithRegexConditional
> = {
  render: () => (
    <>
      <TupleSelectWithRegexConditional
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
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
    value: "build_variant",
  },
  {
    displayName: "Task",
    placeHolderText: "Search Task names",
    value: "task",
  },
];
