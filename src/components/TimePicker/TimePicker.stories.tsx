import { useState } from "react";
import TimePicker from ".";

export default {
  title: "Components/TimePicker",
  component: TimePicker,
  args: {
    disabled: false,
    value: new Date(2020, 0, 1, 0, 0, 0),
  },
};

export const Default = ({ value, ...args }) => {
  const [v, setV] = useState(value);
  return <TimePicker {...args} value={v} onChange={(d) => setV(d)} />;
};
