import InteractionRing from "@leafygreen-ui/interaction-ring";
import { palette } from "@leafygreen-ui/palette";
import generatePicker from "antd/es/date-picker/generatePicker";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import { size } from "constants/tokens";
import "antd/es/date-picker/style/index";

const { gray } = palette;

const GeneratedDatePicker = generatePicker<Date>(dateFnsGenerateConfig);

type GeneratedDatePickerProps = React.ComponentPropsWithRef<
  typeof GeneratedDatePicker
>;

type DatePickerProps = GeneratedDatePickerProps & {
  disabled?: boolean;
};
const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { disabled = false } = props;
  return (
    <InteractionRing disabled={disabled}>
      <GeneratedDatePicker {...props} style={leafygreenInputStyle} />
    </InteractionRing>
  );
};

const leafygreenInputStyle = {
  border: `1px solid ${gray.base}`,
  borderRadius: size.xxs,
  transition: "border-color 150ms ease-in-out",
};

export default DatePicker;
