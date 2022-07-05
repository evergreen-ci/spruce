import { useState } from "react";
import PageSizeSelector from ".";

export default {
  title: "Components/PageSizeSelector",
  component: PageSizeSelector,
};

export const Default = () => {
  const [pageSize, setPageSize] = useState(10);
  return <PageSizeSelector value={pageSize} onChange={setPageSize} />;
};
