import { CustomStoryObj, CustomMeta } from "test_utils/types";

import DatePicker from ".";

export default {
  component: DatePicker,
} satisfies CustomMeta<typeof DatePicker>;

export const Default: CustomStoryObj<typeof DatePicker> = {
  render: (args) => <DatePicker {...args} onChange={() => {}} />,
  args: {
    disabled: false,
  },
};
