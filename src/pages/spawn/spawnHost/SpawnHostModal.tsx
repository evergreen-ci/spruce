import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import { AutoComplete, Input } from "antd";
import { useSpawnAnalytics } from "analytics";
import Icon from "components/Icon";
import { Modal } from "components/Modal";
import { ModalContent, RegionSelector } from "components/Spawn";
import { InputLabel } from "components/styles";
import { HR } from "components/styles/Layout";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  DistrosQuery,
  DistrosQueryVariables,
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
  SpawnHostMutation,
  SpawnHostMutationVariables,
  GetUserSettingsQuery,
} from "gql/generated/types";
import { SPAWN_HOST } from "gql/mutations";
import {
  GET_DISTROS,
  GET_MY_PUBLIC_KEYS,
  GET_AWS_REGIONS,
  GET_MY_VOLUMES,
  GET_USER_SETTINGS,
} from "gql/queries";
import { useDisableSpawnExpirationCheckbox } from "hooks";
import { string } from "utils";
import {
  HostDetailsForm,
  PublicKeyForm,
  publicKeyStateType,
  useSpawnHostModalState,
} from "./spawnHostModal/index";

const { omitTypename, stripNewLines } = string;
interface SpawnHostModalProps {
  visible: boolean;
  onCancel: () => void;
}
export const SpawnHostModal: React.VFC<SpawnHostModalProps> = ({
  visible,
  onCancel,
}) => {
  const dispatchToast = useToastContext();
  const spawnAnalytics = useSpawnAnalytics();
  // QUERY distros
  const { data: distrosData, loading: distroLoading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(GET_DISTROS, {
    variables: {
      onlySpawnable: true,
    },
  });

  // QUERY aws regions
  const { data: awsData, loading: awsLoading } = useQuery<
    AwsRegionsQuery,
    AwsRegionsQueryVariables
  >(GET_AWS_REGIONS);

  // QUERY user settings to get user's preferred aws region
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  const { region: userAwsRegion } = userSettingsData?.userSettings ?? {};

  // QUERY public keys
  const { data: publicKeysData, loading: publicKeyLoading } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  // QUERY volumes
  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(GET_MY_VOLUMES);

  // UPDATE HOST STATUS MUTATION
  const [spawnHostMutation, { loading: loadingSpawnHost }] = useMutation<
    SpawnHostMutation,
    SpawnHostMutationVariables
  >(SPAWN_HOST, {
    onCompleted(hostMutation) {
      const { id } = hostMutation?.spawnHost;
      onCancel();
      dispatchToast.success(`Successfully spawned host: ${id}`);
    },
    onError(err) {
      onCancel();
      dispatchToast.error(
        `There was an error while spawning your host: ${err.message}`
      );
    },
    refetchQueries: ["MyHosts", "MyVolumes", "GetMyPublicKeys"],
  });

  const [distroInput, setDistroInput] = useState("");
  const { reducer } = useSpawnHostModalState();
  const [spawnHostModalState, dispatch] = reducer;

  const { distroId, region, publicKey } = spawnHostModalState;

  const publicKeys = publicKeysData?.myPublicKeys;
  const awsRegions = awsData?.awsRegions;
  const volumes = volumesData?.myVolumes ?? [];

  // When the modal is opened, pre-fill parts of the form (AWS region, public key, and expiration).
  useEffect(() => {
    if (awsRegions && awsRegions.length) {
      dispatch({
        type: "editAWSRegion",
        region: userAwsRegion || awsRegions[0],
      });
    }
    if (publicKeys && publicKeys.length) {
      dispatch({
        type: "editPublicKey",
        publicKey: publicKeys[0],
        savePublicKey: false,
      });
    }
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    dispatch({
      type: "editExpiration",
      expiration: futureDate,
      noExpiration: false,
    });
  }, [visible, userAwsRegion, awsRegions, publicKeys]); // eslint-disable-line react-hooks/exhaustive-deps

  const unexpirableCountReached = useDisableSpawnExpirationCheckbox(false);

  // recalculate isVirtualWorkstation whenever distro changes
  // initial distroId can be changed from URL
  useEffect(() => {
    const isVirtualWorkstation = !!distrosData?.distros.find(
      (vd) => distroId === vd.name
    )?.isVirtualWorkStation;
    dispatch({
      type: "editDistroEffect",
      isVirtualWorkstation,
      noExpiration: isVirtualWorkstation && !unexpirableCountReached, // only default virtual workstations to unexpirable if possible
    });
  }, [distroId, dispatch, distrosData?.distros, unexpirableCountReached]);

  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  const filteredDistros = (distrosData?.distros ?? [])
    .filter((d) => d.name.includes(distroInput))
    .sort((a, b) => a.name.localeCompare(b.name));

  const distroOptions = [
    {
      label: renderTitle("WORKSTATION DISTROS"),
      options: filteredDistros
        .filter((d) => d.isVirtualWorkStation)
        .map((d) => renderItem(d.name)),
    },
    {
      label: renderTitle("OTHER DISTROS"),
      options: filteredDistros
        .filter((d) => !d.isVirtualWorkStation)
        .map((d) => renderItem(d.name)),
    },
  ];

  const canSubmitSpawnHost = !(
    distroId === "" ||
    region === "" ||
    publicKey?.key === ""
  );

  const spawnHost = (e) => {
    e.preventDefault();

    // Remove new lines from public key on submit
    const { publicKey: keyToSubmit } = spawnHostModalState;
    const varsToSubmit = omitTypename({
      ...spawnHostModalState,
      publicKey: {
        name: keyToSubmit.name,
        key: stripNewLines(keyToSubmit.key),
      },
    });

    spawnAnalytics.sendEvent({
      name: "Spawned a host",
      params: varsToSubmit,
    });
    spawnHostMutation({
      variables: { SpawnHostInput: varsToSubmit },
    });
  };

  const editDistro = (d: string) => {
    dispatch({
      type: "editDistro",
      distroId: d,
    });
  };

  const onClose = () => {
    dispatch({ type: "reset" }); // reset modal content
    onCancel();
  };

  return (
    <Modal
      title="Spawn New Host"
      visible={visible}
      onCancel={onClose}
      footer={[
        // @ts-expect-error
        <WideButton onClick={onClose} key="cancel_button">
          Cancel
        </WideButton>,
        <WideButton
          data-cy="spawn-host-button"
          disabled={!canSubmitSpawnHost || loadingSpawnHost} // @ts-expect-error
          onClick={spawnHost}
          variant={Variant.Primary}
          key="spawn_host_button"
        >
          {loadingSpawnHost ? "Spawning Host" : "Spawn"}
        </WideButton>,
      ]}
      data-cy="spawn-host-modal"
    >
      <ModalContent>
        <Subtitle> Required Host Information</Subtitle>
        <Section>
          <InputLabel htmlFor="distroSearchBox">Distro</InputLabel>
          <AutoComplete
            data-cy="distroSearchBox"
            style={{ width: 280, marginLeft: 0 }}
            options={distroOptions}
            id="distroSearchBox"
            onChange={editDistro}
            value={distroId}
          >
            <Input
              value={distroId}
              style={{ width: 200 }}
              placeholder="Search for distro"
              suffix={<Icon glyph="MagnifyingGlass" />}
              data-cy="distro-input"
              onChange={(e) => setDistroInput(e.target.value)}
            />
          </AutoComplete>
        </Section>
        <Section>
          <RegionSelector
            onChange={(v) => dispatch({ type: "editAWSRegion", region: v })}
            selectedRegion={spawnHostModalState.region}
            awsRegions={awsRegions}
          />
        </Section>
        <Section>
          <PublicKeyForm
            publicKeys={publicKeys}
            data={spawnHostModalState}
            onChange={(data: publicKeyStateType) =>
              dispatch({ type: "editPublicKey", ...data })
            }
          />
        </Section>
        <HR />
        <HostDetailsForm
          data={spawnHostModalState}
          onChange={dispatch}
          volumes={volumes}
          isSpawnHostModal
        />
      </ModalContent>
    </Modal>
  );
};

const renderTitle = (title: string) => <b>{title}</b>;

const renderItem = (title: string) => ({
  value: title,
  label: <span key={`distro_${title}`}>{title}</span>,
});

const Section = styled(ModalContent)`
  margin-top: ${size.m};
`;

// @ts-expect-error
const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;
