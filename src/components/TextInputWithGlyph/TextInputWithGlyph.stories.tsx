import { useState } from "react";
import Icon from "components/Icon";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import TextInputWithGlyph from ".";

export default {
  component: TextInputWithGlyph,
} satisfies CustomMeta<typeof TextInputWithGlyph>;

export const Default: CustomStoryObj<typeof TextInputWithGlyph> = {
  args: {
    label: "Some search field",
    placeholder: "Search",
  },
  render: (args) => <Input {...args} />,
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
