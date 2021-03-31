import { useState } from "react";
import { Input, Select } from "antd";
import { useLocation } from "react-router";
import Icon from "components/icons/Icon";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseQueryString } from "utils";

const { Option } = Select;
type option = {
  value: string;
  displayName: string;
  placeHolderText: string;
};
interface TupleSelectProps {
  options: option[];
}
export const TupleSelect: React.FC<TupleSelectProps> = ({ options }) => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(options[0].value);
  const updateQueryParams = useUpdateURLQueryParams();
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const onClick = () => {
    const selectedParams = queryParams[selected] as string[];
    const updatedParams = upsertQueryParam(selectedParams, input);
    updateQueryParams({ [selected]: updatedParams });
    setInput("");
  };
  const selectedOption = options.find((o) => o.value === selected);
  return (
    <Input.Group compact>
      <Select
        style={{ width: "30%" }}
        value={selected}
        onChange={(v) => setSelected(v)}
        aria-label="Select Drop Down"
        data-cy="tuple-select-dropdown"
      >
        {options.map((o) => (
          <Option key={o.value} value={o.value}>
            {o.displayName}
          </Option>
        ))}
      </Select>
      <Input
        aria-label="Select Text Input"
        data-cy="tuple-select-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%" }}
        placeholder={selectedOption.placeHolderText}
        suffix={
          <Icon
            glyph="Plus"
            onClick={onClick}
            aria-label="Select plus button"
            data-cy="tuple-select-button"
          />
        }
        onPressEnter={onClick}
      />
    </Input.Group>
  );
};

const upsertQueryParam = (params: string[] | string, value: string) => {
  if (params === undefined) {
    return [value];
  }
  if (typeof params === "string" && params === value) {
    return params;
  }
  if (Array.isArray(params) && params.find((param) => param === value)) {
    return [...params];
  }
  return Array.isArray(params) ? [...params, value] : [params, value];
};
