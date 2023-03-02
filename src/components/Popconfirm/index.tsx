import { useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Popover, { Align, Justify } from "@leafygreen-ui/popover";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { white } = palette;

interface PopconfirmProps {
  active: boolean;
  align?: Align;
  justify?: Justify;
  "data-cy"?: string;
  content: React.ReactNode;
  refEl?: React.RefObject<HTMLElement>;
  onCancel?: () => void;
  onConfirm?: () => void;
  setActive: (open: boolean) => void;
}

const Popconfirm: React.VFC<PopconfirmProps> = ({
  active,
  align = "top",
  justify = "middle",
  "data-cy": dataCy,
  content,
  refEl,
  onCancel = () => {},
  onConfirm = () => {},
  setActive,
}) => {
  const popoverRef = useRef(null);
  useOnClickOutside([popoverRef, refEl], () => setActive(false));

  return (
    <Popover
      data-cy={dataCy}
      align={align}
      justify={justify}
      active={active}
      refEl={refEl}
      popoverZIndex={zIndex.popover}
    >
      <ContentWrapper ref={popoverRef}>
        {content}
        <ButtonWrapper>
          <Button
            size="small"
            onClick={() => {
              onCancel();
              setActive(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={() => {
              onConfirm();
              setActive(false);
            }}
          >
            Ok
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </Popover>
  );
};

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${white};
  max-width: 300px;
  // The following properties have been lifted from other LeafyGreen styles.
  border-radius: ${size.s};
  padding: 12px 16px;
  box-shadow: 0px 2px 4px -1px rgba(0, 30, 43, 0.15);
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  margin-top: ${size.xs};
  gap: ${size.xxs};
`;

export default Popconfirm;
