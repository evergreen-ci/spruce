import { useState } from "react";
import Icon from "components/Icon";
import TextInputWithGlyph from ".";

export default {
  title: "TextInputWithGlyph",
  component: TextInputWithGlyph,
};

export const Default = () => {
  const [value, setValue] = useState("");
  return (
    <div style={{ width: "40%" }}>
      <TextInputWithGlyph
        icon={<Icon glyph="MagnifyingGlass" />}
        placeholder="Search"
        label="Some search field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
