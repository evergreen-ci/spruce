import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Description } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";
import ElementWrapper from "components/SpruceForm/ElementWrapper";
import { useToastContext } from "context/toast";
import {
  DeleteDistroMutation,
  DeleteDistroMutationVariables,
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { DELETE_DISTRO } from "gql/mutations";
import { USER_DISTRO_SETTINGS_PERMISSIONS } from "gql/queries";

interface ModalProps {
  closeModal: () => void;
  distroId: string;
  open: boolean;
}

const Modal: React.FC<ModalProps> = ({ closeModal, distroId, open }) => {
  const dispatchToast = useToastContext();

  const [deleteDistro] = useMutation<
    DeleteDistroMutation,
    DeleteDistroMutationVariables
  >(DELETE_DISTRO, {
    onCompleted: () => {
      dispatchToast.success(
        `The distro “${distroId}” was deleted. Future visits to this page will result in an error.`,
      );
    },
    onError: (err) => {
      dispatchToast.error(err.message);
    },
    refetchQueries: ["Distros"],
  });

  const onConfirm = () => {
    deleteDistro({
      variables: {
        distroId,
      },
    });
    closeModal();
  };

  return (
    <ConfirmationModal
      buttonText="Delete"
      data-cy="delete-distro-modal"
      onCancel={closeModal}
      onConfirm={onConfirm}
      open={open}
      requiredInputText={distroId}
      title={`Delete “${distroId}”?`}
      variant="danger"
    >
      <p>This action cannot be undone.</p>
    </ConfirmationModal>
  );
};

export const DeleteDistro: React.FC = () => {
  const { distroId } = useParams<{ distroId: string }>();
  const [open, setOpen] = useState(false);
  const id = "delete-distro-button";

  const { data } = useQuery<
    UserDistroSettingsPermissionsQuery,
    UserDistroSettingsPermissionsQueryVariables
  >(USER_DISTRO_SETTINGS_PERMISSIONS, {
    variables: { distroId },
  });
  const isAdmin = data?.user?.permissions?.distroPermissions?.admin;

  return (
    <>
      <Modal
        closeModal={() => setOpen(false)}
        distroId={distroId}
        open={open}
      />
      <ElementWrapper>
        <Description>
          Delete this distro configuration. Active hosts will be terminated and
          the task queue will be cleared.
        </Description>
      </ElementWrapper>
      <Tooltip
        data-cy="delete-button-tooltip"
        enabled={!isAdmin}
        trigger={
          <Button
            id={id}
            onClick={() => setOpen(true)}
            variant="danger"
            data-cy={id}
            disabled={!isAdmin}
          >
            Delete distro
          </Button>
        }
      >
        You must be an admin to perform this action.
      </Tooltip>
    </>
  );
};
