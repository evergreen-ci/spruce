import React from "react";
import { Modal } from "antd";
import Button from "@leafygreen-ui/button";
import { H2 } from "@leafygreen-ui/typography";

interface SpawnHostModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}
export const SpawnHostModal: React.FC<SpawnHostModalProps> = ({
  visible,
  onOk,
  onCancel,
}) => (
  <Modal
    title={<H2>Spawn New Host</H2>}
    visible={visible}
    onOk={onOk}
    onCancel={onCancel}
    footer={[
      <Button onClick={onCancel}>Cancel</Button>,
      <Button
        data-cy="spawn-host-button"
        disabled={false}
        onClick={() => undefined}
        variant="danger"
      >
        Restart
      </Button>,
    ]}
    width="50%"
    wrapProps={{
      "data-cy": "patch-restart-modal",
    }}
  >
    Spawn Host modal
  </Modal>
);
