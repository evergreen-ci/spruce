import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { useOnClickOutside } from "hooks";

const { gray, white } = uiColors;

interface DropdownButtonProps {
  ["data-cy"]?: string;
  disabled?: boolean;
  buttonRenderer?: () => React.ReactNode;
  buttonText?: string;
  children?: React.ReactNode;
}
const DropdownButton: React.FC<DropdownButtonProps> = ({
  "data-cy": dataCy = "dropdown-button",
  disabled = false,
  buttonText,
  buttonRenderer,
  children,
}) => {
  const listMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [isOpen, setisOpen] = useState(false);
  // Handle onClickOutside
  useOnClickOutside([listMenuRef, menuButtonRef], () => setisOpen(false));

  return (
    <>
      <StyledButton
        ref={menuButtonRef}
        onClick={() => setisOpen((curr) => !curr)}
        data-cy={dataCy}
        id="searchable-dropdown"
        disabled={disabled}
        rightGlyph={<Icon glyph={isOpen ? "ChevronUp" : "ChevronDown"} />}
      >
        <ButtonContent>
          <LabelWrapper>
            {buttonRenderer ? (
              buttonRenderer()
            ) : (
              <Body data-cy="dropdown-value">{buttonText}</Body>
            )}
          </LabelWrapper>
        </ButtonContent>
      </StyledButton>
      {isOpen && (
        <RelativeWrapper>
          <OptionsWrapper ref={listMenuRef} data-cy={`${dataCy}-options`}>
            {children}
          </OptionsWrapper>
        </RelativeWrapper>
      )}
    </>
  );
};

// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;

const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: 100%;
`;

const LabelWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* @ts-expect-error */
const StyledButton = styled(Button)`
  width: 100%;
` as typeof Button;

const ButtonContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export default DropdownButton;
