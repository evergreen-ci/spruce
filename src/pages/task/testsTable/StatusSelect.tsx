import React from "react";
import Checkbox from "@leafygreen-ui/checkbox";

const handleOnChange = ({ state, value, onChange }) => {
  state.includes(value)
    ? onChange(state.filter(v => v != value))
    : onChange([...state, value]);
};
export const StatusSelect = ({ state, tData, onChange }) => {
  const rows = tData.map(({ title, value, key }) => {
    return (
      <Checkbox
        key={key}
        className="my-checkbox"
        onChange={() => handleOnChange({ state, value, onChange })}
        label={title}
        checked={state.includes(value)}
        bold={false}
      />
    );
  });
  return rows;
};
