import React, { useState } from "react";
import { Select, Input } from "antd";
import styled from "@emotion/styled";
import { useMutation } from "@apollo/client";
import { Modal } from "components/Modal";
import { Button } from "components/Button";
import {
  UpdateHostStatusMutation,
  UpdateHostStatusMutationVariables,
} from "gql/generated/types";
import { UPDATE_HOST_STATUS } from "gql/mutations";
import { useBannerDispatchContext } from "context/banners";
import { UpdateHostStatus } from "types/host";
import { Body } from "@leafygreen-ui/typography";

import { useHostsTableAnalytics } from "analytics";

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  visible: boolean;
  dataCy: string;
  hostIds: string[];
  closeModal: () => void;
  isSingleHost?: boolean;
}

export const UpdateStatusModal: React.FC<Props> = ({
  visible,
  dataCy,
  hostIds,
  closeModal,
  isSingleHost = false,
}) => {
  const dispatchBanner = useBannerDispatchContext();

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

      dispatchBanner.successBanner(message);

      resetForm();
    },
    onError(error) {
      closeModal();
      dispatchBanner.errorBanner(
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
    <Modal
      data-cy={dataCy}
      visible={visible}
      onCancel={onClickCancel}
      title="Update Host Status"
      footer={[
        <Button dataCy="modal-cancel-button" onClick={onClickCancel}>
          Cancel
        </Button>,
        <Button
          dataCy="modal-update-button"
          variant="primary"
          disabled={!status}
          loading={loadingUpdateHostStatus}
          onClick={onClickUpdate}
        >
          Update
        </Button>,
      ]}
    >
      <Body weight="medium">Host Status</Body>
      <StyledSelect
        data-cy="host-status-select"
        value={status}
        onChange={(s) => setHostStatus(s as UpdateHostStatus)}
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
const StyledSelect = styled(Select)`
  width: 100%;
  margin-bottom: 24px;
`;
const StyledTextArea = styled(TextArea)`
  resize: none;
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
];
