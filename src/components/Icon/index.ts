import { createIconComponent, glyphs, Size } from "@leafygreen-ui/icon";
import * as icons from "./icons";

const glyphMap = {
  ...glyphs,
  ...icons,
};

export { glyphMap as glyphs, Size };
export default createIconComponent(glyphMap);
