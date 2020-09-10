import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { Input, Select } from "antd";
import { Modal } from "components/Modal";
import { InputLabel } from "components/styles";
import {
  Host,
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import { GET_INSTANCE_TYPES, GET_MY_VOLUMES } from "gql/queries";
import {
  HostExpirationField,
  VolumesField,
} from "pages/spawn/spawnHost/fields";

const { Option } = Select;

interface editSpawnHostState {
  expiration: Date;
  noExpiration: boolean;
  displayName?: string;
  instanceType?: string;
  volume: string;
}
interface EditSpawnHostModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  host: Host;
}
export const EditSpawnHostModal: React.FC<EditSpawnHostModalProps> = ({
  visible,
  onCancel,
  host,
}) => {
  const { expiration, noExpiration } = host;
  const [editSpawnHostState, setEditSpawnHostState] = useState<
    editSpawnHostState
  >({
    displayName: host.displayName,
    expiration,
    noExpiration,
    instanceType: host.instanceType,
    volume: host.homeVolumeID,
  });

  // QUERY get_instance_types
  const { data: instanceTypesData } = useQuery<
    InstanceTypesQuery,
    InstanceTypesQueryVariables
  >(GET_INSTANCE_TYPES);

  // QUERY volumes
  const { data: volumesData } = useQuery<MyVolumesQuery, MyHostsQueryVariables>(
    GET_MY_VOLUMES
  );

  const { displayName, instanceType } = editSpawnHostState;

  const instanceTypes = instanceTypesData?.instanceTypes;
  const volumes = volumesData?.myVolumes;

  return (
    <Modal
      title="Edit Host Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton onClick={onCancel}>Cancel</WideButton>,
        <WideButton
          data-cy="save-spawn-host-button"
          disabled={false}
          onClick={() => undefined}
          variant={Variant.Primary}
        >
          Save
        </WideButton>,
      ]}
      data-cy="spawn-host-modal"
    >
      <Container>
        <SectionContainer>
          <SectionLabel weight="medium">Host Name</SectionLabel>
          <Section>
            <InputLabel htmlFor="instanceTypeDropdown">Host Name</InputLabel>
            <Input
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
          <HostExpirationField
            data={editSpawnHostState}
            onChange={setEditSpawnHostState}
          />
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">Host Name</SectionLabel>

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
