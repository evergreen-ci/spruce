import { withKnobs, boolean } from "@storybook/addon-knobs";
import Dropdown from ".";

export default {
  title: "Dropdown",
  decorators: [withKnobs],
};

export const Story = () => (
  <Dropdown disabled={boolean("disabled", false)} buttonText="Test">
    Some Children
  </Dropdown>
);

export const CustomButtonRender = () => (
  <Dropdown
    disabled={boolean("disabled", false)}
    buttonRenderer={() => <b>Some Magic Button</b>}
  >
    Some Children
  </Dropdown>
);
