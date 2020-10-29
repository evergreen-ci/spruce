import React, { useState } from "react";
import { Select, Input, Modal } from "antd";

import { Parameter } from "types/patch";

const { Option } = Select;
const { TextArea } = Input;

interface ParametersProps {
  parameters: Parameter[];
  onCancel: () => void;
  visible: boolean;
}
export const ParametersModal: React.FC<ParametersProps> = ({
  parameters,
  visible,
  onCancel,
}) => (
  <Modal
    visible={visible}
    footer={null}
    onCancel={onCancel}
    title="Patch Parameters"
  />
);
