import React, { useState } from "react";
import { Select, Input } from "antd";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/react-hooks";
import { Modal } from "components/Modal";
import { Button } from "components/Button";
import {
  UpdateHostStatusMutation,
  UpdateHostStatusMutationVariables,
} from "gql/generated/types";
import { UPDATE_HOST_STATUS } from "gql/mutations";
import { useBannerDispatchContext } from "context/banners";
import { HostStatus } from "types/host";
import { Body } from "@leafygreen-ui/typography";

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  visible: boolean;
  dataCy: string;
  hostIds: string[];
  closeModal: () => void;
}

export const UpdateStatusModal: React.FC<Props> = ({
  visible,
  dataCy,
  hostIds,
  closeModal,
}) => {
  const dispatchBanner = useBannerDispatchContext();

  const [status, setHostStatus] = useState<HostStatus | null>(null);

  const [notes, setNotesValue] = useState<string>("");

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
      dispatchBanner.successBanner(
        `Status was changed to ${status} for ${numberOfHostsUpdated} host${
          numberOfHostsUpdated === 1 ? "" : "s"
        }`
      );
      resetForm();
    },
    onError(error) {
      closeModal();
      dispatchBanner.errorBanner(
        `There was an error updating hosts status: ${error}`
      );
    },
  });

  const onClickUpdate = () => {
    updateHostStatus({ variables: { hostIds, status, notes } });
  };

  const onClickCancel = () => {
    closeModal();
    resetForm();
  };

  return (
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onClickCancel}
      title="Update Host Status"
      footer={
        <Buttons>
          <ButtonWrapper>
            <Button dataCy="modal-cancel-button" onClick={onClickCancel}>
              Cancel
            </Button>
          </ButtonWrapper>
          <Button
            dataCy="modal-update-button"
            variant="primary"
            disabled={!status}
            loading={loadingUpdateHostStatus}
            onClick={onClickUpdate}
          >
            Update
          </Button>
        </Buttons>
      }
    >
      <Body weight="medium">Host Status</Body>
      <StyledSelect
        data-cy="host-status-select"
        value={status}
        onChange={(s) => setHostStatus(s as HostStatus)}
      >
        {hostStatuses.map(({ title, value, key }) => (
          <Option key={key} value={value} data-cy={`${value}-option`}>
            {title}
          </Option>
        ))}
      </StyledSelect>
      <Body weight="medium">Add Notes</Body>
      <StyledTextArea
        data-cy="host-status-notes"
        value={notes}
        autoSize={{ minRows: 4, maxRows: 6 }}
        onChange={(e) => setNotesValue(e.target.value)}
      />
    </Modal>
  );
};

// STYLES
const Buttons = styled.div`
  display: flex;
  flex-wrap: nowrap;
`;
const ButtonWrapper = styled.div`
  margin-right: 16px;
`;
const StyledSelect = styled(Select)`
  width: 100%;
  margin-bottom: 24px;
`;
const StyledTextArea = styled(TextArea)`
  resize: none;
`;

// HOSTS STATUSES DATA FOR SELECT COMPONENT
interface Status {
  title: keyof typeof HostStatus;
  value: HostStatus;
  key: HostStatus;
}

const hostStatuses: Status[] = [
  {
    title: "Running",
    value: HostStatus.Running,
    key: HostStatus.Running,
  },
  {
    title: "Starting",
    value: HostStatus.Starting,
    key: HostStatus.Starting,
  },
  {
    title: "Provisioning",
    value: HostStatus.Provisioning,
    key: HostStatus.Provisioning,
  },
  {
    title: "Terminated",
    value: HostStatus.Terminated,
    key: HostStatus.Terminated,
  },
  {
    title: "Decommissioned",
    value: HostStatus.Decommissioned,
    key: HostStatus.Decommissioned,
  },
  {
    title: "Quarantined",
    value: HostStatus.Quarantined,
    key: HostStatus.Quarantined,
  },
  {
    title: "ProvisionFailed",
    value: HostStatus.ProvisionFailed,
    key: HostStatus.ProvisionFailed,
  },
  {
    title: "Uninitialized",
    value: HostStatus.Uninitialized,
    key: HostStatus.Uninitialized,
  },
  {
    title: "Building",
    value: HostStatus.Building,
    key: HostStatus.Building,
  },
  {
    title: "Success",
    value: HostStatus.Success,
    key: HostStatus.Success,
  },
  {
    title: "Stopping",
    value: HostStatus.Stopping,
    key: HostStatus.Stopping,
  },
  {
    title: "Stopped",
    value: HostStatus.Stopped,
    key: HostStatus.Stopped,
  },
  {
    title: "Failed",
    value: HostStatus.Failed,
    key: HostStatus.Failed,
  },
  {
    title: "ExternalUserName",
    value: HostStatus.ExternalUserName,
    key: HostStatus.ExternalUserName,
  },
];
