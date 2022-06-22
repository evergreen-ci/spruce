import { action } from "@storybook/addon-actions";
import DatePicker from ".";

export default {
  title: "Components/DatePicker",
  component: DatePicker,
  args: {
    disabled: false,
  },
};

export const Default = (args) => {
  <DatePicker {...args} onChange={(d) => action("Date changed")(d)} />;
};
