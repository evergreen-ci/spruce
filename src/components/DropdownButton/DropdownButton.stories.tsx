import { withKnobs, boolean } from "@storybook/addon-knobs";
import DropdownButton from ".";

export default {
  title: "DropdownButton",
  decorators: [withKnobs],
};

export const Story = () => (
  <DropdownButton disabled={boolean("disabled", false)} buttonText="Test">
    Some Children
  </DropdownButton>
);

export const CustomButtonRender = () => (
  <DropdownButton buttonRenderer={() => <b>Some Magic Button</b>}>
    Some Children
  </DropdownButton>
);
