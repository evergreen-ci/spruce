import { StoryObj } from "@storybook/react";
import ExpandedText from ".";

export default {
  component: ExpandedText,
};

export const Default: StoryObj<typeof ExpandedText> = {
  render: () => <ExpandedText message="Here is some hidden text" />,
};
