import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Popover from "@leafygreen-ui/popover";
import { PopoverContainer } from "components/styles/Popover";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";

interface Props {
  buttonText: string;
  titleText: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  "data-cy"?: string;
}

export const HostPopover: React.FC<Props> = ({
  buttonText,
  "data-cy": dataCy,
  disabled = false,
  loading,
  onClick,
  titleText,
}) => {
  const [active, setActive] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([buttonRef, popoverRef], () => setActive(false));

  return (
    <>
      <ButtonWrapper ref={buttonRef}>
        <Button
          onClick={() => setActive((curr) => !curr)}
          data-cy={dataCy}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </ButtonWrapper>
      <Popover
        align="bottom"
        justify="middle"
        active={active}
        data-cy={`${dataCy}-popover`}
        popoverZIndex={zIndex.popover}
      >
        <PopoverContainer ref={popoverRef}>
          {titleText}

          <ButtonContainer>
            <ButtonSpacer>
              <Button
                size="xsmall"
                disabled={loading}
                onClick={() => setActive(false)}
              >
                No
              </Button>
            </ButtonSpacer>
            <ButtonSpacer>
              <Button
                variant="primary"
                size="xsmall"
                disabled={loading}
                onClick={() => {
                  onClick();
                  setActive(false);
                }}
              >
                Yes
              </Button>
            </ButtonSpacer>
          </ButtonContainer>
        </PopoverContainer>
      </Popover>
    </>
  );
};

const ButtonWrapper = styled.div`
  white-space: nowrap; // prevent button collapse when screen is small
`;
const ButtonContainer = styled.div`
  margin-top: ${size.xs};
  display: flex;
  justify-content: flex-end;
`;
const ButtonSpacer = styled.div`
  margin-left: ${size.xs};
`;
