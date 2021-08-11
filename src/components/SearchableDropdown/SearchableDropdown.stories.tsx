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
  const [value, setValue] = useState("");

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
