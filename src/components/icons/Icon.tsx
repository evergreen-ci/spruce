import { createIconComponent, glyphs } from "@leafygreen-ui/icon";
import * as icons from "./Icons";

const glyphMap = {
  ...glyphs,
  ...icons,
};

export default createIconComponent(glyphMap);
