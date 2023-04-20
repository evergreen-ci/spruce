import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Tooltip, { TooltipProps } from "@leafygreen-ui/tooltip";
import { wordBreakCss } from "components/styles";
import { size, zIndex } from "constants/tokens";

type PopconfirmProps = TooltipProps & {
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-cy"?: string;
  onConfirm?: (e?: React.MouseEvent) => void;
};

const Popconfirm: React.VFC<PopconfirmProps> = ({
  children,
  confirmDisabled = false,
  confirmText = "Yes",
  onClose = () => {},
  onConfirm = () => {},
  open: controlledOpen,
  setOpen: controlledSetOpen,
  ...props
}) => {
  const isControlled = controlledOpen !== undefined && controlledSetOpen;
  const [uncontrolledOpen, uncontrolledSetOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledSetOpen : uncontrolledSetOpen;

  const popoverRef = useRef<HTMLDivElement>(null);

  return (
    <Tooltip
      popoverZIndex={zIndex.popover}
      triggerEvent="click"
      open={open}
      onClose={onClose}
      setOpen={setOpen}
      {...props}
    >
      <ContentWrapper ref={popoverRef}>
        {children}
        <ButtonWrapper>
          <Button
            size="small"
            onClick={() => {
              onClose();
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={confirmDisabled}
            size="small"
            variant="primary"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmText}
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </Tooltip>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};

  ${wordBreakCss}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: ${size.xs};
  gap: ${size.xxs};
`;

export default Popconfirm;
