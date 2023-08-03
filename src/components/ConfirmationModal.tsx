import styled from "@emotion/styled";
import Modal from "@leafygreen-ui/confirmation-modal";
import { zIndex } from "constants/tokens";

// @ts-expect-error
export const ConfirmationModal = styled(Modal)`
  z-index: ${zIndex.modal};
`;
