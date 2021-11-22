import { useState } from "react";
import SelectSearch from ".";

export default {
  title: "Select Search",
  component: SelectSearch,
};

export const Story = () => {
  const [placeholder, setPlaceholder] = useState("1");

  return (
    <SelectSearch
      searchPlaceholder={placeholder}
      onChange={setPlaceholder}
      options={["1", "2", "3"]}
    />
  );
};

export const CustomOption = () => {
  type SelectOption = {
    label: string;
    value: string;
  };

  const selectOptions = [
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
  const [placeholder, setPlaceholder] = useState<SelectOption>(
    selectOptions[0]
  );

  const handleSearch = (options: SelectOption[], match: string) =>
    options.filter((o) => o.value.toLowerCase().includes(match.toLowerCase()));

  return (
    <SelectSearch
      searchPlaceholder={placeholder.label}
      onChange={setPlaceholder}
      options={selectOptions}
      searchFunc={handleSearch}
      optionRenderer={(option: SelectOption, onClick) => (
        <button onClick={() => onClick(option)} type="button">
          {option.label}
        </button>
      )}
    />
  );
};
