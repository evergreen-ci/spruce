import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Tooltip, { TooltipProps } from "@leafygreen-ui/tooltip";
import { wordBreakCss } from "components/styles";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";

type PopconfirmProps = TooltipProps & {
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-cy"?: string;
  onConfirm?: (e?: React.MouseEvent) => void;
  children: React.ReactNode;
};

const Popconfirm: React.FC<PopconfirmProps> = ({
  children,
  confirmDisabled = false,
  confirmText = "Yes",
  onClose = () => {},
  onConfirm = () => {},
  open: controlledOpen,
  refEl,
  setOpen: controlledSetOpen,
  ...props
}) => {
  const isControlled = !!(controlledOpen !== undefined && controlledSetOpen);
  const [uncontrolledOpen, uncontrolledSetOpen] = useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledSetOpen : uncontrolledSetOpen;

  const popoverRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([popoverRef, ...(refEl ? [refEl] : [])], () => {
    onClose();
    setOpen(false);
  });

  return (
    <Tooltip
      popoverZIndex={zIndex.popover}
      triggerEvent="click"
      open={open}
      onClose={onClose}
      refEl={refEl}
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
            onClick={(e) => {
              onConfirm(e);
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
