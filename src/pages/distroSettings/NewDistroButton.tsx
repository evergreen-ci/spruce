import { useState } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import Icon from "components/Icon";
import { zIndex } from "constants/tokens";
import { CopyModal } from "./CopyModal";
import { CreateModal } from "./CreateModal";

export const NewDistroButton: React.VFC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <Menu
        data-cy="new-distro-menu"
        open={menuOpen}
        popoverZIndex={zIndex.popover}
        setOpen={setMenuOpen}
        trigger={
          <Button leftGlyph={<Icon glyph="Plus" />} size={Size.Small}>
            New distro
          </Button>
        }
      >
        <MenuItem
          data-cy="create-distro-button"
          onClick={() => {
            setMenuOpen(false);
            setCreateModalOpen(true);
          }}
        >
          Create new distro
        </MenuItem>
        <MenuItem
          data-cy="copy-distro-button"
          onClick={() => {
            setMenuOpen(false);
            setCopyModalOpen(true);
          }}
        >
          Copy distro
        </MenuItem>
      </Menu>
      <CopyModal
        handleClose={() => setCopyModalOpen(false)}
        open={copyModalOpen}
      />
      <CreateModal
        handleClose={() => setCreateModalOpen(false)}
        open={createModalOpen}
      />
    </>
  );
};
