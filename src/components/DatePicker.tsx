import InteractionRing from "@leafygreen-ui/interaction-ring";
import { uiColors } from "@leafygreen-ui/palette";
import generatePicker from "antd/es/date-picker/generatePicker";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import { size } from "constants/tokens";

import "antd/es/date-picker/style/css";

const { gray } = uiColors;

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export default (props) => {
  const { disabled } = props;
  return (
    <InteractionRing disabled={disabled}>
      <DatePicker {...props} style={leafygreenInputStyle} />
    </InteractionRing>
  );
};

const leafygreenInputStyle = {
  border: `1px solid ${gray.base}`,
  borderRadius: size.xxs,
  transition: "border-color 150ms ease-in-out",
};
