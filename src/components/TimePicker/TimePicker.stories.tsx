import TimePicker from ".";

export default {
  title: "Components/TimePicker",
  component: TimePicker,
  args: {
    disabled: false,
  },
};

export const Default = (args) => <TimePicker {...args} onChange={() => {}} />;
