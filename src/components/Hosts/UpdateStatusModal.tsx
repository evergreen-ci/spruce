import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Select, Option } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import { useHostsTableAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UpdateHostStatusMutation,
  UpdateHostStatusMutationVariables,
} from "gql/generated/types";
import { UPDATE_HOST_STATUS } from "gql/mutations";
import { UpdateHostStatus } from "types/host";

interface Props {
  visible: boolean;
  "data-cy": string;
  hostIds: string[];
  closeModal: () => void;
  isSingleHost?: boolean;
}

export const UpdateStatusModal: React.FC<Props> = ({
  closeModal,
  "data-cy": dataCy,
  hostIds,
  isSingleHost = false,
  visible,
}) => {
  const dispatchToast = useToastContext();

  const [status, setHostStatus] = useState<UpdateHostStatus>(null);

  const [notes, setNotesValue] = useState<string>("");

  const hostsTableAnalytics = useHostsTableAnalytics(isSingleHost);

  const resetForm = () => {
    setHostStatus(null);
    setNotesValue("");
  };

  // UPDATE HOST STATUS MUTATION
  const [updateHostStatus, { loading: loadingUpdateHostStatus }] = useMutation<
    UpdateHostStatusMutation,
    UpdateHostStatusMutationVariables
  >(UPDATE_HOST_STATUS, {
    onCompleted({ updateHostStatus: numberOfHostsUpdated }) {
      closeModal();
      const message = isSingleHost
        ? `Status was changed to ${status}`
        : `Status was changed to ${status} for ${numberOfHostsUpdated} host${
            numberOfHostsUpdated === 1 ? "" : "s"
          }`;

      dispatchToast.success(message);

      resetForm();
    },
    onError(error) {
      closeModal();
      dispatchToast.error(
        `There was an error updating hosts status: ${error.message}`
      );
    },
    refetchQueries: ["Hosts"],
  });

  const onClickUpdate = () => {
    hostsTableAnalytics.sendEvent({ name: "Update Status", status });
    updateHostStatus({ variables: { hostIds, status, notes } });
  };

  const onClickCancel = () => {
    closeModal();
    resetForm();
  };

  return (
    <ConfirmationModal
      data-cy={dataCy}
      open={visible}
      onCancel={onClickCancel}
      onConfirm={onClickUpdate}
      title="Update Host Status"
      buttonText="Update"
      submitDisabled={!status || loadingUpdateHostStatus}
    >
      <StyledSelect
        label="Host Status"
        data-cy="host-status-select"
        value={status}
        onChange={(s) => {
          setHostStatus(s as UpdateHostStatus);
        }}
      >
        {hostStatuses.map(({ key, title, value }) => (
          <Option key={key} value={value} data-cy={`${value}-option`}>
            {title}
          </Option>
        ))}
      </StyledSelect>
      <TextArea
        label="Add Notes"
        data-cy="host-status-notes"
        value={notes}
        rows={6}
        onChange={(e) => setNotesValue(e.target.value)}
      />
    </ConfirmationModal>
  );
};

const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
`;
// HOSTS STATUSES DATA FOR SELECT COMPONENT
interface Status {
  title: keyof typeof UpdateHostStatus;
  value: UpdateHostStatus;
  key: UpdateHostStatus;
}

const hostStatuses: Status[] = [
  {
    title: "Decommissioned",
    value: UpdateHostStatus.Decommissioned,
    key: UpdateHostStatus.Decommissioned,
  },
  {
    title: "Quarantined",
    value: UpdateHostStatus.Quarantined,
    key: UpdateHostStatus.Quarantined,
  },
  {
    title: "Running",
    value: UpdateHostStatus.Running,
    key: UpdateHostStatus.Running,
  },
  {
    title: "Terminated",
    value: UpdateHostStatus.Terminated,
    key: UpdateHostStatus.Terminated,
  },
  {
    title: "Stopped",
    value: UpdateHostStatus.Stopped,
    key: UpdateHostStatus.Stopped,
  },
];
