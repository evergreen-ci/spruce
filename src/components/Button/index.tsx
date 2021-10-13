import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";

export const Button: ExtendableBox<
  ButtonProps & { ref?: React.Ref<any>; loading?: boolean; dataCy?: string },
  "button"
> = ({ loading, leftGlyph, dataCy, children, ...props }) => (
  <LeafyGreenButton
    {...props}
    data-cy={dataCy}
    leftGlyph={
      loading ? <LoadingOutlined style={{ marginRight: "8px" }} /> : leftGlyph
    }
  >
    {children}
  </LeafyGreenButton>
);
