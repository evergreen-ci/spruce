import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Variant } from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { Input, Select } from "antd";
import { diff } from "deep-object-diff";
import isEqual from "lodash.isequal";
import { useSpawnAnalytics } from "analytics";
import Icon from "components/Icon";
import { Modal } from "components/Modal";
import {
  ModalContent,
  SectionContainer,
  SectionLabel,
  WideButton,
  ExpirationField,
} from "components/Spawn";
import { ExpirationDateType } from "components/Spawn/ExpirationField";
import { InputLabel, StyledLink } from "components/styles";
import { windowsPasswordRulesURL } from "constants/externalResources";
import { useToastContext } from "context/toast";
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
import {
  VolumesField,
  UserTagsField,
  VolumesData,
  UserTagsData,
} from "pages/spawn/spawnHost/fields";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { string } from "utils";
import { useEditSpawnHostModalState } from "./editSpawnHostModal/useEditSpawnHostModalState";

const { Option } = Select;
const { omitTypename } = string;

interface EditSpawnHostModalProps {
  visible?: boolean;
  onCancel: () => void;
  host: MyHost;
}
export const EditSpawnHostModal: React.FC<EditSpawnHostModalProps> = ({
  visible = true,
  onCancel,
  host,
}) => {
  const dispatchToast = useToastContext();

  const spawnAnalytics = useSpawnAnalytics();
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

      dispatchToast.success(`Successfully modified spawned host: ${id}`);
      onCancel();
    },
    onError(err) {
      onCancel();
      dispatchToast.error(
        `There was an error while modifying your host: ${err.message}`
      );
    },
    refetchQueries: ["MyVolumes"],
  });

  const instanceTypes = instanceTypesData?.instanceTypes;
  const volumes = volumesData?.myVolumes?.filter(
    (v) => v.availabilityZone === host.availabilityZone
  );

  const [hasChanges, mutationParams] = computeDiff(
    defaultEditSpawnHostState,
    editSpawnHostState
  );

  const onSubmit = (e) => {
    e.preventDefault();

    spawnAnalytics.sendEvent({
      name: "Edited a Spawn Host",
      params: {
        hostId: host.id,
        ...mutationParams,
      },
    });
    editSpawnHostMutation({
      variables: {
        hostId: host.id,
        ...mutationParams,
      },
    });
  };

  const canEditInstanceType = host.status === HostStatus.Stopped; // User can only update the instance type when it is paused
  const canEditRDPPassword =
    host.distro.isWindows && host.status === HostStatus.Running;
  const [openTooltip, setOpenTooltip] = useState(true);
  return (
    <Modal
      title="Edit Host Details"
      visible={visible}
      onCancel={onCancel}
      footer={[
        // @ts-expect-error
        <WideButton onClick={onCancel} key="cancel_button">
          Cancel
        </WideButton>,
        <WideButton
          data-cy="save-spawn-host-button"
          disabled={hasChanges || loadingSpawnHost} // @ts-expect-error
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
          <ModalContent>
            <InputLabel htmlFor="hostNameInput">Host Name</InputLabel>
            <Input
              id="hostNameInput"
              value={editSpawnHostState.displayName}
              onChange={(e) =>
                dispatch({ type: "editHostName", displayName: e.target.value })
              }
            />
          </ModalContent>
        </SectionContainer>
        <ExpirationField
          isVolume={false}
          targetItem={host}
          data={editSpawnHostState}
          onChange={(data: ExpirationDateType) =>
            dispatch({ type: "editExpiration", ...data })
          }
        />
        <SectionContainer>
          <SectionLabel weight="medium">Instance Type</SectionLabel>
          <ModalContent>
            <InputLabel htmlFor="instanceTypeDropdown">
              Instance Types
            </InputLabel>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <span
              onMouseEnter={() => {
                setOpenTooltip(true);
                console.log(openTooltip);
              }}
              onMouseLeave={() => {
                setOpenTooltip(false);
                console.log(openTooltip);
              }}
            >
              <Tooltip
                align="top"
                justify="middle"
                usePortal={false}
                enabled
                open
                trigger={
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
                    disabled={!canEditInstanceType}
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
                }
              >
                Pause this host to adjust this field.
              </Tooltip>
            </span>
          </ModalContent>
        </SectionContainer>
        <SectionContainer>
          <SectionLabel weight="medium">Add Volume</SectionLabel>
          <VolumesField
            data={editSpawnHostState}
            onChange={(data: VolumesData) =>
              dispatch({ type: "editVolumes", ...data })
            }
            volumes={volumes}
          />
        </SectionContainer>
        {canEditRDPPassword && (
          <SectionContainer>
            <SectionLabel weight="medium">Set RDP Password</SectionLabel>

            <ModalContent>
              <InputLabel htmlFor="rdpPasswordInput">
                Set New RDP Password
              </InputLabel>
              <FlexContainer>
                <Input
                  value={editSpawnHostState.servicePassword}
                  onChange={(e) =>
                    dispatch({
                      type: "editServicePassword",
                      servicePassword: e.target.value,
                    })
                  }
                  id="rdpPasswordInput"
                  type="password"
                />
                <Tooltip
                  align="top"
                  justify="middle"
                  // triggerEvent="hover"
                  enabled
                  open
                  usePortal={false}
                  trigger={<PaddedIcon glyph="QuestionMarkWithCircle" />}
                >
                  <>
                    Password should match the criteria defined{" "}
                    <StyledLink href={windowsPasswordRulesURL} target="__blank">
                      here.
                    </StyledLink>
                  </>
                </Tooltip>
              </FlexContainer>
            </ModalContent>
          </SectionContainer>
        )}
        <SectionContainer>
          <SectionLabel weight="medium">User Tags</SectionLabel>
          <UserTagsField
            onChange={(data: UserTagsData) =>
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
  ) as EditSpawnHostMutationVariables;

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

const PaddedIcon = styled(Icon)`
  margin-left: 16px;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;
