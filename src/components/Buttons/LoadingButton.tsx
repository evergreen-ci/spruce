import { forwardRef } from "react";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import Icon from "components/Icon";

type Props = ButtonProps & {
  loading?: boolean;
};

export const LoadingButton: ExtendableBox<
  Props & { ref?: React.Ref<any> },
  "button"
> = forwardRef(({ loading = false, leftGlyph, ...rest }: Props, ref) => (
  <LeafyGreenButton
    ref={ref}
    leftGlyph={loading ? <Icon glyph="Loading" /> : leftGlyph}
    {...rest}
  />
));
