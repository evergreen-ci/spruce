import Dropdown from ".";

export default {
  title: "Components/Dropdown",
  component: Dropdown,
  args: {
    disabled: false,
  },
};

export const Story = (args) => <Dropdown {...args}>Some Children</Dropdown>;

export const CustomButtonRender = (args) => (
  <Dropdown {...args} buttonRenderer={() => <b>Some Magic Button</b>}>
    Some Children
  </Dropdown>
);
