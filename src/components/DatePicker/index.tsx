import styled from "@emotion/styled";
import { useIdAllocator } from "@leafygreen-ui/hooks";
import InteractionRing from "@leafygreen-ui/interaction-ring";
import { palette } from "@leafygreen-ui/palette";
import { Label } from "@leafygreen-ui/typography";
import generatePicker from "antd/es/date-picker/generatePicker";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import { size } from "constants/tokens";
import "antd/es/date-picker/style/index";

const { gray } = palette;

const GeneratedDatePicker = generatePicker<Date>(dateFnsGenerateConfig);

type GeneratedDatePickerProps = React.ComponentPropsWithRef<
  typeof GeneratedDatePicker
>;

export type DatePickerProps = {
  disabled?: boolean;
  id?: string;
  label?: string;
};

const DatePicker: React.VFC<GeneratedDatePickerProps & DatePickerProps> = ({
  disabled = false,
  id: propsId,
  label,
  ...props
}) => {
  const id = useIdAllocator({ prefix: "datepicker", id: propsId });
  return (
    <Wrapper>
      {label && (
        <Label htmlFor={id} disabled={disabled}>
          {label}
        </Label>
      )}
      <InteractionRing disabled={disabled}>
        <GeneratedDatePicker
          {...props}
          id={id}
          style={leafygreenInputStyle}
          // @ts-expect-error
          getPopupContainer={getPopupContainer}
        />
      </InteractionRing>
    </Wrapper>
  );
};

// Fixes bug where DatePicker won't handle onClick events
const getPopupContainer = (triggerNode: HTMLElement) => triggerNode.parentNode;

const leafygreenInputStyle = {
  border: `1px solid ${gray.base}`,
  borderRadius: size.xxs,
  transition: "border-color 150ms ease-in-out",
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default DatePicker;
