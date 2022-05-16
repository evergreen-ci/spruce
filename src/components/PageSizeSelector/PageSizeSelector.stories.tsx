import { useState } from "react";
import PageSizeSelector from ".";

export default {
  title: "PageSizeSelector",
  component: PageSizeSelector,
};

export const Default = () => {
  const [pageSize, setPageSize] = useState(10);
  return (
    <PageSizeSelector
      data-cy="my-patches-page-size-selector"
      value={pageSize}
      onChange={setPageSize}
    />
  );
};
