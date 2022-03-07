import React, { useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { gray, white } = uiColors;

interface DropdownProps {
  ["data-cy"]?: string;
  id?: string;
  disabled?: boolean;
  buttonRenderer?: () => React.ReactNode;
  buttonText?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
}
const Dropdown: React.FC<DropdownProps> = ({
  "data-cy": dataCy = "dropdown-button",
  id,
  disabled = false,
  buttonText,
  buttonRenderer,
  children,
  isOpen,
  setIsOpen,
  onClose = () => {},
}) => {
  const listMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleClickOutside = () => {
    setIsOpen(false);
    onClose();
  };

  // Handle onClickOutside
  useOnClickOutside([listMenuRef, menuButtonRef], handleClickOutside);

  return (
    <Container id={id}>
      <StyledButton
        ref={menuButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        data-cy={dataCy}
        disabled={disabled}
        rightGlyph={<Icon glyph={isOpen ? "ChevronUp" : "ChevronDown"} />}
      >
        <ButtonContent>
          <LabelWrapper>
            {buttonRenderer ? (
              buttonRenderer()
            ) : (
              <OverflowBody data-cy="dropdown-value">{buttonText}</OverflowBody>
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
    </Container>
  );
};

interface DropdownWithRefProps
  extends Omit<DropdownProps, "isOpen" | "setIsOpen"> {
  ref?: React.Ref<DropdownWithRef>;
}

interface DropdownWithRefState {
  isOpen: boolean;
}
/** DropdownWithRef is a class component that allows the implementer
 *  to control its internal state methods with a ref in order to trigger state updates */
class DropdownWithRef extends React.Component<
  DropdownWithRefProps,
  DropdownWithRefState
> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  setIsOpen = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <Dropdown {...this.props} isOpen={isOpen} setIsOpen={this.setIsOpen} />
    );
  }
}
// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;

const OptionsWrapper = styled.div`
  border-radius: ${size.xxs};
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: ${size.xs};
  box-shadow: 0 ${size.xs} ${size.xs} 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: ${zIndex.dropdown};
  margin-top: ${size.xs};
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
  max-width: 90%;
`;

const OverflowBody = styled(Body)`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default DropdownWithRef;
