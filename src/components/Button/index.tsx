import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";

type Props = ButtonProps & {
  loading?: boolean;
};

const Button: ExtendableBox<
  Props & { ref?: React.Ref<any> },
  "button"
> = React.forwardRef(
  ({ loading = false, leftGlyph, ...rest }: Props, forwardRef) => (
    <LeafyGreenButton
      ref={forwardRef}
      {...rest}
      leftGlyph={
        loading ? <LoadingOutlined style={{ marginRight: "8px" }} /> : leftGlyph
      }
    />
  )
);

export { Button };
