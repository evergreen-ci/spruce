import { CustomStoryObj, CustomMeta } from "test_utils/types";

import TimePicker, { TimePickerProps } from ".";

export default {
  component: TimePicker,
} satisfies CustomMeta<typeof TimePicker>;

export const Default: CustomStoryObj<TimePickerProps> = {
  args: {
    disabled: false,
  },
  render: (args) => <TimePicker {...args} onChange={() => {}} />,
};
