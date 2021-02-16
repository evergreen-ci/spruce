import generatePicker from "antd/lib/date-picker/generatePicker";
import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export default DatePicker;
