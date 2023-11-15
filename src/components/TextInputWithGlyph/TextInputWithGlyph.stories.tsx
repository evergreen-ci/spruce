import { useState } from "react";
import Icon from "components/Icon";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import TextInputWithGlyph from ".";

export default {
  title: "Components/TextInput/TextInputWithGlyph",
  component: TextInputWithGlyph,
} satisfies CustomMeta<typeof TextInputWithGlyph>;

export const Default: CustomStoryObj<typeof TextInputWithGlyph> = {
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
