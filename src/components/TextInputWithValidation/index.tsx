import { useState, forwardRef } from "react";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import IconTooltip from "components/IconTooltip";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import type { TextInputWithGlyphProps } from "components/TextInputWithGlyph";

const { yellow } = palette;
type TextInputWithValidationProps = {
  /**
   * `onSubmit` will be called when the user submits a new input with the enter key or the plus button
   * if the input is valid
   * @param value - the value of the input
   * @returns void
   */
  onSubmit?: (value: string) => void;
  validator?: (value: string) => boolean;
  /**
   * `onChange` will be called when the user types into the input and the input is valid
   * @param value - the value of the input
   * @returns void
   */
  onChange?: (value: string) => void;
  validatorErrorMessage?: string;
  placeholder?: string;
  /**
   * If true, the input will be cleared when the user submits a new input
   */
  clearOnSubmit?: boolean;
} & Omit<TextInputWithGlyphProps, "icon" | "onSubmit" | "onChange">;

const TextInputWithValidation: React.FC<TextInputWithValidationProps> =
  forwardRef((props, ref) => {
    const {
      "aria-label": ariaLabel,
      clearOnSubmit = false,
      label,
      onChange = () => {},
      onSubmit = () => {},
      validator = () => true,
      validatorErrorMessage = "Invalid input",
      ...rest
    } = props;

    const [input, setInput] = useState("");
    const isValid = validator(input);

    const handleOnSubmit = () => {
      if (isValid) {
        onSubmit(input);
        if (clearOnSubmit) {
          setInput("");
        }
      }
    };

    const handleOnChange = (value: string) => {
      if (validator(value)) {
        onChange(value);
      }
      setInput(value);
    };

    return (
      <TextInputWithGlyph
        value={input}
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && handleOnSubmit()
        }
        label={label}
        aria-label={ariaLabel}
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
            <IconTooltip
              glyph="Warning"
              fill={yellow.base}
              aria-label="validation error"
            >
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
