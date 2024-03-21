import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Size, Variant } from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { useParams } from "react-router-dom";
import Icon from "components/Icon";
import { slugs } from "constants/routes";
import { zIndex } from "constants/tokens";
import {
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { USER_DISTRO_SETTINGS_PERMISSIONS } from "gql/queries";
import { CopyModal } from "./CopyModal";
import { CreateModal } from "./CreateModal";

export const NewDistroButton: React.FC = () => {
  const { [slugs.distroId]: distroId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data } = useQuery<
    UserDistroSettingsPermissionsQuery,
    UserDistroSettingsPermissionsQueryVariables
  >(USER_DISTRO_SETTINGS_PERMISSIONS, {
    variables: { distroId },
  });
  const {
    user: {
      permissions: { canCreateDistro },
    },
  } = data ?? { user: { permissions: {} } };

  if (!canCreateDistro) {
    return null;
  }

  return (
    <>
      <Menu
        data-cy="new-distro-menu"
        open={menuOpen}
        popoverZIndex={zIndex.popover}
        setOpen={setMenuOpen}
        trigger={
          <StyledButton
            data-cy="new-distro-button"
            leftGlyph={<Icon glyph="Plus" />}
            size={Size.Small}
            variant={Variant.Primary}
          >
            New distro
          </StyledButton>
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

const StyledButton = styled(Button)`
  width: fit-content;
`;
