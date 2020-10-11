import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Variant } from "@leafygreen-ui/button";
import { Input, Select } from "antd";
import { diff } from "deep-object-diff";
import isEqual from "lodash.isequal";
import { Modal } from "components/Modal";
import {
  ModalContent,
  Section,
  SectionContainer,
  SectionLabel,
  WideButton,
} from "components/Spawn";
import { InputLabel } from "components/styles";
import {
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import { GET_INSTANCE_TYPES, GET_MY_VOLUMES } from "gql/queries";
import {
  HostExpirationField,
  VolumesField,
  UserTagsField,
} from "pages/spawn/spawnHost/fields";
import { MyHost } from "types/spawn";
import { useEditSpawnHostModalState } from "./editSpawnHostModal/useEditSpawnHostModalState";

const { Option } = Select;

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
  const { reducer, defaultEditSpawnHostState } = useEditSpawnHostModalState(
    host
  );
  const [editSpawnHostState, dispatch] = reducer;

  useEffect(() => {
    dispatch({ type: "reset", host });
  }, [visible, dispatch, host]);

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
      <ModalContent>
        <SectionContainer>
          <SectionLabel weight="medium">Host Name</SectionLabel>
          <Section>
            <InputLabel htmlFor="hostNameInput">Host Name</InputLabel>
            <Input
              id="hostNameInput"
              value={editSpawnHostState.displayName}
              onChange={(e) =>
                dispatch({ type: "editHostName", displayName: e.target.value })
              }
            />
          </Section>
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">Expiration</SectionLabel>
          <HostExpirationField
            data={editSpawnHostState}
            onChange={(data) => dispatch({ type: "editExpiration", ...data })}
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
                dispatch({
                  type: "editInstanceType",
                  instanceType: v,
                })
              }
              value={editSpawnHostState.instanceType}
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
            onChange={(data) => dispatch({ type: "editVolumes", ...data })}
            volumes={volumes}
          />
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">User Tags</SectionLabel>
          <UserTagsField
            onChange={(data) => dispatch({ type: "editInstanceTags", ...data })}
            instanceTags={host?.instanceTags}
            visible={visible}
          />
        </SectionContainer>
      </ModalContent>
    </Modal>
  );
};
