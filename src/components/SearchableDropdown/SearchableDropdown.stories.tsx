import { useState } from "react";
import { StoryObj } from "@storybook/react";
import SearchableDropdown, { SearchableDropdownProps } from ".";

export default {
  component: SearchableDropdown,
};

export const Default: StoryObj<SearchableDropdownProps<string>> = {
  render: (args) => <Dropdown {...args} />,
  args: {
    allowMultiSelect: false,
    disabled: false,
    label: "Searchable Dropdown",
  },
};

const Dropdown = (props) => {
  const [value, setValue] = useState([]);
  return (
    <SearchableDropdown
      value={value}
      onChange={setValue}
      options={["1", "2", "3"]}
      {...props}
    />
  );
};

export const CustomOption = () => {
  const [value, setValue] = useState([]);
  const options = [
    {
      label: "Option 1",
      value: "1",
    },
    {
      label: "Option 2",
      value: "2",
    },
    {
      label: "Option 3",
      value: "3",
    },
  ];
  return (
    <SearchableDropdown
      label="Custom option select"
      value={value}
      onChange={setValue}
      options={options}
      allowMultiSelect
      optionRenderer={(option, onClick, isChecked) => (
        <button
          onClick={() => onClick(option.value)}
          type="button"
          key={option.value}
        >
          {isChecked(option.value) && `✔️`}
          {option.label}
        </button>
      )}
    />
  );
};
