import { StoryObj } from "@storybook/react";
import DatePicker from ".";

export default {
  component: DatePicker,
};

export const Default: StoryObj<typeof DatePicker> = {
  render: (args) => <DatePicker {...args} onChange={() => {}} />,
  args: {
    disabled: false,
  },
};
