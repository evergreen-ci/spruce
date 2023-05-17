import { StoryObj } from "@storybook/react";
import TimePicker, { TimePickerProps } from ".";

export default {
  component: TimePicker,
};

export const Default: StoryObj<TimePickerProps> = {
  render: (args) => <TimePicker {...args} onChange={() => {}} />,
  args: {
    disabled: false,
  },
};
