import { cloneElement, useState } from "react";
import { useQuery } from "@apollo/client";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { PlusButton, Size, Variant } from "components/Buttons";
import { zIndex } from "constants/tokens";
import { GetUserPermissionsQuery } from "gql/generated/types";
import { GET_USER_PERMISSIONS } from "gql/queries";
import { CopyProjectModal } from "./CopyProjectModal";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectType } from "./tabs/utils";

const NewProjectButton = (
  <PlusButton
    size={Size.Small}
    data-cy="new-project-button"
    variant={Variant.Primary}
  >
    New Project
  </PlusButton>
);

interface Props {
  id: string;
  label: string;
  owner: string;
  projectType: ProjectType;
  repo: string;
}

export const CreateDuplicateProjectButton: React.VFC<Props> = ({
  id,
  label,
  owner,
  projectType,
  repo,
}) => {
  const { data } = useQuery<GetUserPermissionsQuery>(GET_USER_PERMISSIONS);
  const {
    user: {
      permissions: { canCreateProject },
    },
  } = data ?? { user: { permissions: {} } };

  const [menuOpen, setMenuOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  if (!canCreateProject) {
    return null;
  }

  return (
    <>
      {projectType === ProjectType.Repo ? (
        // Use cloneElement so that the same component can be used as a button and a Menu trigger
        cloneElement(NewProjectButton, {
          onClick: () => setCreateModalOpen(true),
        })
      ) : (
        <Menu
          open={menuOpen}
          setOpen={setMenuOpen}
          popoverZIndex={zIndex.popover}
          trigger={NewProjectButton}
          data-cy="new-project-menu"
        >
          <MenuItem
            data-cy="create-project-button"
            onClick={() => {
              setMenuOpen(false);
              setCreateModalOpen(true);
            }}
          >
            Create New Project
          </MenuItem>
          <MenuItem
            data-cy="copy-project-button"
            onClick={() => {
              setMenuOpen(false);
              setCopyModalOpen(true);
            }}
          >
            Duplicate Current Project
          </MenuItem>
        </Menu>
      )}
      <CreateProjectModal
        handleClose={() => setCreateModalOpen(false)}
        open={createModalOpen}
        owner={owner}
        repo={repo}
      />
      <CopyProjectModal
        handleClose={() => setCopyModalOpen(false)}
        id={id}
        label={label}
        open={copyModalOpen}
      />
    </>
  );
};
