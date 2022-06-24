import { useState, useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Popover from "@leafygreen-ui/popover";
import { PopoverContainer } from "components/styles/Popover";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";

interface Props {
  buttonText: string;
  titleText: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  "data-cy"?: string;
}

export const HostPopover: React.VFC<Props> = ({
  buttonText,
  titleText,
  loading,
  disabled = false,
  onClick,
  "data-cy": dataCy,
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
      <StyledPopover
        align="bottom"
        justify="middle"
        active={active}
        data-cy={`${dataCy}-popover`}
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
      </StyledPopover>
    </>
  );
};

// @ts-expect-error
// For leafygreen Popover, there is a bug where you have to set the width to prevent misalignment when
// the trigger element is near the right side of a page. Ticket: https://jira.mongodb.org/browse/PD-1542
const StyledPopover = styled(Popover)`
  width: 300px;
`;

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
