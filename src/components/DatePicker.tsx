import dateFnsGenerateConfig from "rc-picker/lib/generate/dateFns";
import generatePicker from "antd/es/date-picker/generatePicker";

const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export default DatePicker;
