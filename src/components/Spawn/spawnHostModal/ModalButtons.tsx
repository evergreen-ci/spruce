import { SyntheticEvent } from "react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { size } from "constants/tokens";

interface Props {
  disableSubmit: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (e: SyntheticEvent) => void;
  submitButtonCopy: string;
  submitButtonLoadingCopy: string;
}

export const ModalButtons: React.FC<Props> = ({
  disableSubmit,
  loading,
  onCancel,
  onSubmit,
  submitButtonCopy,
  submitButtonLoadingCopy,
}) => (
  <>
    <WideButton
      data-cy="submit-button"
      disabled={disableSubmit}
      // @ts-expect-error
      onClick={onSubmit}
      variant={Variant.Primary}
      key="submit-button"
    >
      {loading ? submitButtonLoadingCopy : submitButtonCopy}
    </WideButton>
    <WideButton
      // @ts-expect-error
      onClick={onCancel}
      data-cy="cancel-button"
      key="cancel-button"
    >
      Cancel
    </WideButton>
  </>
);

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  margin-left: ${size.s};
  width: 140px;
`;
