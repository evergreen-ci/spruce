import React, { useState } from "react";
import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { EditSpawnHostModal } from "pages/spawn/spawnHost/index";
import { MyHost } from "./types";

interface EditSpawnHostButtonProps {
  host: MyHost;
}
export const EditSpawnHostButton: React.FC<EditSpawnHostButtonProps> = ({
  host,
}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <PaddedButton
        size={Size.XSmall}
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
        }}
      >
        Edit
      </PaddedButton>
      <EditSpawnHostModal
        visible={openModal}
        onOk={() => {
          setOpenModal(false);
        }}
        onCancel={() => setOpenModal(false)}
        host={host}
      />
    </>
  );
};

const PaddedButton = styled(Button)`
  margin-left: 5px;
  margin-right: 5px;
`;
