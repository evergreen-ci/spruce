import DatePicker from ".";

export default {
  title: "Components/DatePicker",
  component: DatePicker,
  args: {
    disabled: false,
  },
};

export const Default = (args) => <DatePicker {...args} onChange={() => {}} />;
