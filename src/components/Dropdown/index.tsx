import React, { useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { useOnClickOutside } from "hooks";

const { gray, white } = uiColors;

interface DropdownProps {
  ["data-cy"]?: string;
  disabled?: boolean;
  buttonRenderer?: () => React.ReactNode;
  buttonText?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
const Dropdown: React.FC<DropdownProps> = ({
  "data-cy": dataCy = "dropdown-button",
  disabled = false,
  buttonText,
  buttonRenderer,
  children,
  isOpen,
  setIsOpen,
}) => {
  const listMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Handle onClickOutside
  useOnClickOutside([listMenuRef, menuButtonRef], () => setIsOpen(false));

  return (
    <Container>
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
