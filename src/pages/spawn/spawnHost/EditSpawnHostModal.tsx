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
} from "gql/generated/types";
import { GET_INSTANCE_TYPES } from "gql/queries";
import { HostExpirationField } from "pages/spawn/spawnHost/HostExpirationField";

const { Option } = Select;

interface editSpawnHostState {
  expiration: Date;
  noExpiration: boolean;
  displayName?: string;
  instanceType?: string;
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
  });
  const { data: InstanceTypesData } = useQuery<
    InstanceTypesQuery,
    InstanceTypesQueryVariables
  >(GET_INSTANCE_TYPES);

  const { displayName, instanceType } = editSpawnHostState;

  const instanceTypes = InstanceTypesData?.instanceTypes;
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
          <div>
            <Input
              value={displayName}
              onChange={(e) =>
                setEditSpawnHostState({
                  ...editSpawnHostState,
                  displayName: e.target.value,
                })
              }
            />
          </div>
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
