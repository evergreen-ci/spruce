import React from "react";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { ButtonDropdown } from "components/ButtonDropdown";

export const Dropdown: React.FC = () => {
  return <ButtonDropdown isVisibleDropdown={false} dropdownItems={[]} />;
};
