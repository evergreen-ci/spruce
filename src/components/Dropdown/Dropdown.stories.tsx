import { CustomStoryObj, CustomMeta } from "test_utils/types";

import Dropdown from ".";

export default {
  component: Dropdown,
} satisfies CustomMeta<typeof Dropdown>;

export const Default: CustomStoryObj<typeof Dropdown> = {
  args: {
    disabled: false,
  },
  render: (args) => <Dropdown {...args}>Some Children</Dropdown>,
};

export const CustomButtonRender: CustomStoryObj<typeof Dropdown> = {
  args: Default.args,
  render: (args) => (
    <Dropdown {...args} buttonRenderer={() => <b>Some Magic Button</b>}>
      Some Children
    </Dropdown>
  ),
};
