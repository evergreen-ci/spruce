import { CustomStoryObj, CustomMeta } from "test_utils/types";

import NotFound from "./NotFound";

export default {
  component: NotFound,
} satisfies CustomMeta<typeof NotFound>;

export const Default404: CustomStoryObj<typeof NotFound> = {
  render: () => (
    <div style={{ height: "100%", width: "100%" }}>
      <NotFound />
    </div>
  ),
};
