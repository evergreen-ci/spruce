import { useState, forwardRef } from "react";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import IconTooltip from "components/IconTooltip";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import type { TextInputWithGlyphProps } from "components/TextInputWithGlyph";

const { yellow } = palette;
type TextInputWithValidationProps = {
  onSubmit?: (value: string) => void;
  validator?: (value: string) => boolean;
  validatorErrorMessage?: string;
  label?: React.ReactNode;
  placeholder?: string;
} & TextInputWithGlyphProps;

const TextInputWithValidation: React.FC<TextInputWithValidationProps> =
  forwardRef((props, ref) => {
    const {
      onSubmit = () => {},
      placeholder = "",
      validator = () => true,
      validatorErrorMessage = "",
      ...rest
    } = props;

    const [input, setInput] = useState("");
    const isValid = validator(input);

    const handleOnSubmit = () => {
      if (isValid) {
        onSubmit(input);
        setInput("");
      }
    };

    const handleOnChange = (value: string) => {
      setInput(value);
    };

    return (
      <TextInputWithGlyph
        value={input}
        type="search"
        onChange={(e) => handleOnChange(e.target.value)}
        placeholder={placeholder}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && handleOnSubmit()
        }
        ref={ref}
        icon={
          isValid ? (
            <IconButton
              onClick={handleOnSubmit}
              aria-label="Select plus button"
            >
              <Icon glyph="Plus" />
            </IconButton>
          ) : (
            <IconTooltip glyph="Warning" fill={yellow.base}>
              {validatorErrorMessage}
            </IconTooltip>
          )
        }
        {...rest}
      />
    );
  });

TextInputWithValidation.displayName = "TextInputWithValidation";
export default TextInputWithValidation;
