import { StoryObj } from "@storybook/react";
import Dropdown from ".";

export default {
  component: Dropdown,
};

export const Default: StoryObj<typeof Dropdown> = {
  render: (args) => <Dropdown {...args}>Some Children</Dropdown>,
  args: {
    disabled: false,
  },
};

export const CustomButtonRender: StoryObj<typeof Dropdown> = {
  render: (args) => (
    <Dropdown {...args} buttonRenderer={() => <b>Some Magic Button</b>}>
      Some Children
    </Dropdown>
  ),
  args: Default.args,
};
