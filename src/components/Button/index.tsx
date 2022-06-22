import { forwardRef } from "react";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import Icon from "components/Icon";

type Props = ButtonProps & {
  loading?: boolean;
};

const Button: ExtendableBox<
  Props & { ref?: React.Ref<any> },
  "button"
> = forwardRef(({ loading = false, leftGlyph, ...rest }: Props, r) => (
  <LeafyGreenButton
    ref={r}
    {...rest}
    leftGlyph={loading ? <Icon glyph="Loading" /> : leftGlyph}
  />
));

export { Button };
