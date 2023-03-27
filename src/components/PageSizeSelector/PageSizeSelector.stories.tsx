import { useState } from "react";
import { StoryObj } from "@storybook/react";
import PageSizeSelector from ".";

export default {
  component: PageSizeSelector,
};

export const Default: StoryObj<typeof PageSizeSelector> = {
  render: () => <PageSize />,
};

const PageSize = () => {
  const [pageSize, setPageSize] = useState(10);
  return <PageSizeSelector value={pageSize} onChange={setPageSize} />;
};
