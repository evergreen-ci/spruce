import React from "react";
import { Omit } from "antd/es/_util/type";
import { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import DatePicker from "./DatePicker";

export interface TimePickerProps
  extends Omit<PickerTimeProps<Date>, "picker"> {}

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => (
  <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = "TimePicker";

export default TimePicker;
