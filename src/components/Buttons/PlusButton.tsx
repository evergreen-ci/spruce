import { forwardRef } from "react";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import Icon from "components/Icon";

export const PlusButton: ExtendableBox<
  ButtonProps & { ref?: React.Ref<any> },
  "button"
> = forwardRef(({ leftGlyph, ...rest }: ButtonProps, ref) => (
  <LeafyGreenButton
    ref={ref}
    leftGlyph={<Icon glyph="Plus" />}
    as="button"
    {...rest}
  />
));
