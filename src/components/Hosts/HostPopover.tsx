import React, { useRef, useEffect } from "react";
import styled from "@emotion/styled";
import Popover from "@leafygreen-ui/popover";
import { Button } from "components/Button";

interface Props {
  titleText: string;
  loading: boolean;
  onClick: () => void;
  active: boolean;
  setActive: (isActive: boolean) => void;
  "data-cy"?: string;
}

export const HostPopover: React.FC<Props> = ({
  titleText,
  loading,
  onClick,
  active,
  setActive,
  "data-cy": dataCy,
}) => {
  const popoverRef = useRef(null);

  // Handle onClickOutside
  useEffect(() => {
    if (!active) {
      return;
    }
    const onClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [popoverRef, active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledPopover
      align="bottom"
      justify="middle"
      active={active}
      data-cy={dataCy}
    >
      <PopoverContainer ref={popoverRef}>
        {titleText}

        <ButtonContainer>
          <ButtonSpacer>
            <Button size="xsmall" disabled={loading}>
              No
            </Button>
          </ButtonSpacer>
          <ButtonSpacer>
            <Button
              variant="primary"
              size="xsmall"
              disabled={loading}
              onClick={onClick}
            >
              Yes
            </Button>
          </ButtonSpacer>
        </ButtonContainer>
      </PopoverContainer>
    </StyledPopover>
  );
};

// @ts-expect-error
const StyledPopover = styled(Popover)`
  width: 300px;
`;

const PopoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 16px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
`;

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;

const ButtonSpacer = styled.div`
  margin-left: 8px;
`;
