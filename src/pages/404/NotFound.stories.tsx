import { StoryObj } from "@storybook/react";
import NotFound from "./NotFound";

export default {
  component: NotFound,
};

export const Default404: StoryObj<typeof NotFound> = {
  render: () => (
    <div style={{ height: "100%", width: "100%" }}>
      <NotFound />
    </div>
  ),
};
