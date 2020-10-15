import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
  ExpirationField as HostExpirationField,
} from "components/Spawn";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
import {
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
  EditSpawnHostMutation,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { EDIT_SPAWN_HOST } from "gql/mutations";
import { GET_INSTANCE_TYPES, GET_MY_VOLUMES } from "gql/queries";
import { VolumesField, UserTagsField } from "pages/spawn/spawnHost/fields";
import { MyHost } from "types/spawn";
import { omitTypename } from "utils/string";
import {
  useEditSpawnHostModalState,
  editSpawnHostStateType,
  editExpirationData,
  editInstanceTagsData,
  editVolumesData,
} from "./editSpawnHostModal/useEditSpawnHostModalState";

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
  const dispatchBanner = useBannerDispatchContext();

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

  // UPDATE HOST STATUS MUTATION
  const [editSpawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    EditSpawnHostMutation,
    EditSpawnHostMutationVariables
  >(EDIT_SPAWN_HOST, {
    onCompleted(mutationResult) {
      const { id } = mutationResult?.editSpawnHost;
      onCancel();
      dispatchBanner.successBanner(`Successfully modified spawned host: ${id}`);
    },
    onError(err) {
      onCancel();
      dispatchBanner.errorBanner(
        `There was an error while modifying your host: ${err.message}`
      );
    },
  });

  const instanceTypes = instanceTypesData?.instanceTypes;
  const volumes = volumesData?.myVolumes;

  const [hasChanges, mutationParams] = computeDiff(
    defaultEditSpawnHostState,
    editSpawnHostState
  );

  const onSubmit = () => {
    dispatchBanner.clearAllBanners();
    editSpawnHostMutation({
      variables: {
        hostId: host.id,
        ...mutationParams,
      },
    });
  };
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
          disabled={hasChanges || loadingSpawnHost}
          onClick={onSubmit}
          variant={Variant.Primary}
          key="save_spawn_host_button"
        >
          {loadingSpawnHost ? "Saving" : "Save"}
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
            onChange={(data: editExpirationData) =>
              dispatch({ type: "editExpiration", ...data })
            }
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
            onChange={(data: editVolumesData) =>
              dispatch({ type: "editVolumes", ...data })
            }
            volumes={volumes}
          />
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">User Tags</SectionLabel>
          <UserTagsField
            onChange={(data: editInstanceTagsData) =>
              dispatch({ type: "editInstanceTags", ...data })
            }
            instanceTags={host?.instanceTags}
            visible={visible}
          />
        </SectionContainer>
      </ModalContent>
    </Modal>
  );
};

const computeDiff = (defaultEditSpawnHostState, editSpawnHostState) => {
  const hasChanges = isEqual(defaultEditSpawnHostState, editSpawnHostState);

  // diff will return an untyped object which doesn't allow access to the properties so we must
  // type it inorder to have access to its properties.
  const mutationParams = diff(
    defaultEditSpawnHostState,
    editSpawnHostState
  ) as editSpawnHostStateType;

  // diff returns na object to compare the differences in positions of an array. So we take this object
  // and convert it into an array for these fields
  if (mutationParams.addedInstanceTags) {
    mutationParams.addedInstanceTags = omitTypename(
      Object.values(mutationParams.addedInstanceTags)
    );
  }
  if (mutationParams.deletedInstanceTags) {
    mutationParams.deletedInstanceTags = omitTypename(
      Object.values(mutationParams.deletedInstanceTags)
    );
  }

  return [hasChanges, mutationParams];
};
