import { CustomStoryObj, CustomMeta } from "test_utils/types";

import DatePicker from ".";

export default {
  component: DatePicker,
} satisfies CustomMeta<typeof DatePicker>;

export const Default: CustomStoryObj<typeof DatePicker> = {
  args: {
    disabled: false,
  },
  render: (args) => <DatePicker {...args} onChange={() => {}} />,
};
