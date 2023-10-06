import { Variant } from "@leafygreen-ui/button";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { LoadingButton } from ".";

export default {
  component: LoadingButton,
} satisfies CustomMeta<typeof LoadingButton>;

export const Default: CustomStoryObj<typeof LoadingButton> = {
  render: (args) => <LoadingButton {...args}>Button text</LoadingButton>,
  args: {
    loading: false,
    variant: Variant.Default,
  },
  argTypes: {
    variant: {
      options: Object.values(Variant),
      control: { type: "select" },
    },
  },
};
