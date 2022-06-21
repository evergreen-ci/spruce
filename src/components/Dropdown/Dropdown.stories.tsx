import Dropdown from ".";

export default {
  title: "Dropdown",
  component: Dropdown,
  args: {
    disabled: false,
  },
};

export const Story = (args) => <Dropdown {...args}>Some Children</Dropdown>;
Story.args = {
  disabled: false,
  text: "Test",
};

export const CustomButtonRender = (args) => (
  <Dropdown {...args} buttonRenderer={() => <b>Some Magic Button</b>}>
    Some Children
  </Dropdown>
);

CustomButtonRender.args = {
  disabled: false,
};
