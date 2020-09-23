import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Input, Select } from "antd";
import { diff } from "deep-object-diff";
import isEqual from "lodash.isequal";
import { Modal } from "components/Modal";
import { InputLabel } from "components/styles";
import {
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
  InstanceTag,
} from "gql/generated/types";
import { GET_INSTANCE_TYPES, GET_MY_VOLUMES } from "gql/queries";
import {
  HostExpirationField,
  VolumesField,
  UserTagsField,
} from "pages/spawn/spawnHost/fields";
import { MyHost } from "types/spawn";

const { Option } = Select;

interface editSpawnHostState {
  expiration?: Date;
  noExpiration: boolean;
  displayName?: string;
  instanceType?: string;
  volumeId?: string;
  addedInstanceTags?: InstanceTag[];
  deletedInstanceTags?: InstanceTag[];
}
interface EditSpawnHostModalProps {
  visible?: boolean;
  onOk: () => void;
  onCancel: () => void;
  host: MyHost;
}
export const EditSpawnHostModal: React.FC<EditSpawnHostModalProps> = ({
  visible = true,
  onCancel,
  host,
}) => {
  const { expiration, noExpiration, instanceTags } = host;
  const defaultEditSpawnHostState: editSpawnHostState = {
    displayName: host.displayName,
    expiration,
    noExpiration,
    instanceType: host.instanceType,
    addedInstanceTags: [],
    deletedInstanceTags: [],
  };
  const [editSpawnHostState, setEditSpawnHostState] = useState<
    editSpawnHostState
  >(defaultEditSpawnHostState);

  // QUERY get_instance_types
  const { data: instanceTypesData } = useQuery<
    InstanceTypesQuery,
    InstanceTypesQueryVariables
  >(GET_INSTANCE_TYPES);

  // QUERY volumes
  const { data: volumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES);

  const { displayName, instanceType } = editSpawnHostState;

  const instanceTypes = instanceTypesData?.instanceTypes;
  const volumes = volumesData?.myVolumes;

  const hasChanges = isEqual(defaultEditSpawnHostState, editSpawnHostState);

  // This will be used for the mutation submission we are submitting the diff
  // Between the changes and the default values so we don't submit an unchanged field
  const mutationParams = diff(defaultEditSpawnHostState, editSpawnHostState);
  console.log({ mutationParams });
  return (
    <Modal
      title="Edit Host Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton onClick={onCancel} key="cancel_button">
          Cancel
        </WideButton>,
        <WideButton
          data-cy="save-spawn-host-button"
          disabled={hasChanges}
          onClick={() => undefined}
          variant={Variant.Primary}
          key="save_spawn_host_button"
        >
          Save
        </WideButton>,
      ]}
      data-cy="edit-spawn-host-modal"
    >
      <Container>
        <SectionContainer>
          <SectionLabel weight="medium">Host Name</SectionLabel>
          <Section>
            <InputLabel htmlFor="hostNameInput">Host Name</InputLabel>
            <Input
              id="hostNameInput"
              value={displayName}
              onChange={(e) =>
                setEditSpawnHostState({
                  ...editSpawnHostState,
                  displayName: e.target.value,
                })
              }
            />
          </Section>
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">Expiration</SectionLabel>
          <HostExpirationField
            data={editSpawnHostState}
            onChange={setEditSpawnHostState}
          />
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">Instance Type</SectionLabel>
          <Section>
            <InputLabel htmlFor="instanceTypeDropdown">
              Instance Types
            </InputLabel>
            <Select
              id="instanceTypeDropdown"
              showSearch
              style={{ width: 200 }}
              placeholder="Select Instance Type"
              onChange={(v) =>
                setEditSpawnHostState({
                  ...editSpawnHostState,
                  instanceType: v,
                })
              }
              value={instanceType}
            >
              {instanceTypes?.map((instance) => (
                <Option
                  value={instance}
                  key={`instance_type_option_${instance}`}
                >
                  {instance}
                </Option>
              ))}
            </Select>
          </Section>
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">Add Volume</SectionLabel>
          <VolumesField
            data={editSpawnHostState}
            onChange={setEditSpawnHostState}
            volumes={volumes}
          />
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">User Tags</SectionLabel>
          <UserTagsField
            data={editSpawnHostState}
            onChange={setEditSpawnHostState}
            instanceTags={instanceTags}
            visible={visible}
          />
        </SectionContainer>
      </Container>
    </Modal>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const SectionContainer = styled(FlexContainer)`
  align-items: center;
  margin-top: 15px;
`;

const SectionLabel = styled(Body)`
  padding-right: 15px;
  margin-top: 22px;
  min-width: 175px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled(Container)`
  margin-top: 20px;
`;

const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;
