import React from "react";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import Icon from "components/Icon";

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
      leftGlyph={loading ? <Icon glyph="loading" /> : leftGlyph}
    />
  )
);

export { Button };
