import { useState } from "react";
import { StoryObj } from "@storybook/react";
import Icon from "components/Icon";
import TextInputWithGlyph from ".";

export default {
  component: TextInputWithGlyph,
};

export const Default: StoryObj<typeof TextInputWithGlyph> = {
  render: (args) => <Input {...args} />,
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
};

const Input = (props) => {
  const [value, setValue] = useState("");
  return (
    <TextInputWithGlyph
      icon={<Icon glyph="MagnifyingGlass" />}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};
