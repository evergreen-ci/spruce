import { useState } from "react";
import SearchableDropdown from ".";

export default {
  title: "Searchable Dropdown",
  component: SearchableDropdown,
};

export const Story = () => {
  const [value, setValue] = useState("");

  return (
    <SearchableDropdown
      label="standard select"
      value={value}
      onChange={setValue}
      options={["1", "2", "3"]}
    />
  );
};

export const Multiselect = () => {
  const [value, setValue] = useState([]);

  return (
    <SearchableDropdown
      label="multi select"
      value={value}
      onChange={setValue}
      options={["1", "2", "3"]}
      allowMultiselect
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
      allowMultiselect
      optionRenderer={(option, onClick, isChecked) => (
        <button onClick={() => onClick(option.value)} type="button">
          {isChecked(option.value) && `✔️`}
          {option.label}
        </button>
      )}
    />
  );
};
