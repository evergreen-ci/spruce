import { forwardRef } from "react";
import { ExtendableBox } from "@leafygreen-ui/box";
import LeafyGreenButton, { ButtonProps } from "@leafygreen-ui/button";
import { Spinner } from "@leafygreen-ui/loading-indicator";

type Props = Omit<ButtonProps, "isLoading"> & {
  loading?: boolean;
};

export const LoadingButton: ExtendableBox<
  Props & { ref?: React.Ref<any> },
  "button"
> = forwardRef(({ loading = false, ...rest }: Props, ref) => (
  <LeafyGreenButton
    ref={ref}
    isLoading={loading}
    loadingIndicator={<Spinner />}
    {...rest}
  />
));
