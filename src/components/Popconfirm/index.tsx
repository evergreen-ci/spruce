import { cloneElement, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Popover, { Align, Justify } from "@leafygreen-ui/popover";
import Tooltip, { TooltipProps } from "@leafygreen-ui/tooltip";
import { wordBreakCss } from "components/styles";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { white } = palette;

interface UncontrolledPopconfirmProps {
  active?: never;
  setActive?: never;
  refEl?: never;
  trigger: JSX.Element;
}

interface ControlledPopconfirmProps {
  active: boolean;
  setActive: (open: boolean) => void;
  refEl?: React.RefObject<HTMLElement>;
  trigger?: never;
}

interface PopconfirmBase {
  align?: Align;
  children: React.ReactNode;
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-cy"?: string;
  justify?: Justify;
  onCancel?: () => void;
  onConfirm?: (e?: React.MouseEvent) => void;
}

// type PopconfirmProps = PopconfirmBase &
// (UncontrolledPopconfirmProps | ControlledPopconfirmProps);
//
type PopconfirmProps = TooltipProps & {
  confirmDisabled?: boolean;
  confirmText?: string;
  "data-cy"?: string;
  onConfirm?: (e?: React.MouseEvent) => void;
};

const Popconfirm: React.VFC<PopconfirmProps> = ({
  align = "top",
  justify = "middle",
  "data-cy": dataCy,
  children,
  confirmDisabled = false,
  confirmText = "Yes",
  refEl,
  onClose = () => {},
  onConfirm = () => {},
  open,
  setOpen,
  trigger,
}) => {
  console.log(confirmDisabled);
  const popoverRef = useRef<HTMLDivElement>(null);
  return (
    <Tooltip
      align={align}
      data-cy={dataCy}
      justify={justify}
      open={open}
      refEl={refEl}
      popoverZIndex={zIndex.popover}
      setOpen={setOpen}
      triggerEvent="click"
      trigger={trigger}
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

/* const Popconfirm: React.VFC<PopconfirmProps> = ({
  active,
  align = "top",
  justify = "middle",
  "data-cy": dataCy,
  children,
  confirmDisabled = false,
  confirmText = "Yes",
  refEl,
  onCancel = () => {},
  onConfirm = () => {},
  setActive,
  trigger,
}) => {
  const [uncontrolledOpen, uncontrolledSetOpen] = useState<boolean>(false);
  const setOpen = (active !== undefined && setActive) || uncontrolledSetOpen;
  const open = active ?? uncontrolledOpen;

  const triggerRef = useRef(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(
    [popoverRef, ...(refEl ? [refEl] : []), ...(trigger ? [triggerRef] : [])],
    () => {
      setOpen(false);
    }
  );

  const popoverContent = (
    <Popover
      data-cy={dataCy}
      align={align}
      justify={justify}
      active={open}
      refEl={refEl || triggerRef}
      popoverZIndex={zIndex.popover}
    >
      <ContentWrapper ref={popoverRef}>
        {children}
        <ButtonWrapper>
          <Button
            size="small"
            onClick={() => {
              onCancel();
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
    </Popover>
  );

  const triggerClickHandler = (e: React.MouseEvent) => {
    if (open) {
      onCancel();
    }
    setOpen(!open);
    trigger?.props?.onClick?.(e);
    e.nativeEvent.preventDefault();
  };

  const renderedTrigger =
    trigger !== undefined &&
    cloneElement(trigger, {
      ref: triggerRef,
      onClick: triggerClickHandler,
    });

  return (
    <>
      {renderedTrigger}
      {popoverContent}
    </>
  );
}; */

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  max-width: 300px;

  ${wordBreakCss}
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: ${size.xs};
  gap: ${size.xxs};
`;

export default Popconfirm;
