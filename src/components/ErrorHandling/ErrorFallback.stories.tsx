import { StoryObj } from "@storybook/react";
import ErrorFallback from "./ErrorFallback";

export default {
  component: ErrorFallback,
};

export const DefaultError: StoryObj<typeof ErrorFallback> = {
  render: () => (
    <div style={{ height: "100%", width: "100%" }}>
      <ErrorFallback />
    </div>
  ),
};
