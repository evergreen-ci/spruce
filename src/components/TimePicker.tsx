import React from "react";
import { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import DatePicker from "./DatePicker";

import "antd/es/time-picker/style/css";

export interface TimePickerProps
  extends Omit<PickerTimeProps<Date>, "picker"> {}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => (
  <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = "TimePicker";

export default TimePicker;
