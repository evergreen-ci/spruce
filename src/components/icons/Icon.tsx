import { createIconComponent, glyphs } from "@leafygreen-ui/icon";
import * as icons from "./icons";

const glyphMap = {
  ...glyphs,
  ...icons,
};

export default createIconComponent(glyphMap);
