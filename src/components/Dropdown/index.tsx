import { useRef, Component } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";
import { ButtonType } from "types/leafygreen";

const { gray, white } = palette;

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
  buttonRenderer,
  buttonText,
  children,
  "data-cy": dataCy = "dropdown-button",
  disabled = false,
  id,
  isOpen,
  onClose = () => {},
  setIsOpen,
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
/**
 * DropdownWithRef is a class component that allows the implementer to control its internal state methods with a ref in order to trigger state updates
 */
class DropdownWithRef extends Component<
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

// Borrow LeafyGreen's styling to un-center button text
// https://github.com/mongodb/leafygreen-ui/blob/a593238ff5801f82a648c20e3595cfc6de6ec6a8/packages/select/src/MenuButton.tsx#L20-L33
const menuButtonStyleOverrides = css`
  // Override button defaults
  > *:last-child {
    grid-template-columns: 1fr 16px;
    justify-content: flex-start;
    > svg {
      justify-self: right;
      width: 16px;
      height: 16px;
    }
  }
`;

const StyledButton = styled<ButtonType>(Button)`
  ${menuButtonStyleOverrides}
  background: white;
  width: 100%;
`;

const ButtonContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

const OverflowBody = styled(Body)<BodyProps>`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default DropdownWithRef;
