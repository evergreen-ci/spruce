import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { AutoComplete, Input, Select } from "antd";
import Icon from "components/icons/Icon";
import { Modal } from "components/Modal";
import { InputLabel } from "components/styles";
import { useBannerDispatchContext } from "context/banners";
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
  SpawnHostInput,
} from "gql/generated/types";
import { SPAWN_HOST } from "gql/mutations";
import {
  GET_DISTROS,
  GET_MY_PUBLIC_KEYS,
  GET_AWS_REGIONS,
  GET_MY_VOLUMES,
} from "gql/queries";
import { omitTypename } from "utils/string";
import {
  HostDetailsForm,
  hostDetailsStateType,
} from "./spawnHostModal/HostDetailsForm";
import {
  PublicKeyForm,
  publicKeyStateType,
} from "./spawnHostModal/PublicKeyForm";

const { Option } = Select;
const { gray } = uiColors;

interface SpawnHostModalProps {
  visible: boolean;
  onCancel: () => void;
}
export const SpawnHostModal: React.FC<SpawnHostModalProps> = ({
  visible,
  onCancel,
}) => {
  const dispatchBanner = useBannerDispatchContext();

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
    onCompleted(hostMutation: SpawnHostMutation) {
      const { id } = hostMutation?.spawnHost;
      onCancel();
      dispatchBanner.successBanner(`Successfully spawned host: ${id}`);
    },
    onError(err) {
      onCancel();
      dispatchBanner.errorBanner(
        `There was an error while spawning your host: ${err.message}`
      );
    },
    refetchQueries: ["MyHosts"],
  });

  // Public key form state
  const [publicKeyState, setPublicKeyState] = useState<publicKeyStateType>({
    publicKey: {
      name: "",
      key: "",
    },
    savePublicKey: false,
  });
  // optional host details form state
  const [hostDetailsState, setHostDetailsState] = useState<
    hostDetailsStateType
  >({
    hasUserDataScript: false,
    userDataScript: "",
    expiration: null,
    noExpiration: false,
    volumeId: "",
    isVirtualWorkStation: false,
    homeVolumeSize: null,
  });

  const distros = distrosData?.distros;
  const publicKeys = publicKeysData?.myPublicKeys;
  const awsRegions = awsData?.awsRegions;
  const volumes = volumesData?.myVolumes;

  // distro Field for form submision
  const [distro, setDistro] = useState("");
  // aws region field for form submission
  const [awsRegion, setAWSRegion] = useState("");

  // Need to initialize these here so they can be used in the useEffect hook
  let virtualWorkstationDistros = [];
  let notVirtualWorkstationDistros = [];

  useEffect(() => {
    if (virtualWorkstationDistros.find((vd) => distro === vd.name)) {
      setHostDetailsState({
        ...hostDetailsState,
        isVirtualWorkStation: true,
        noExpiration: true,
        expiration: null,
        homeVolumeSize: 500,
      });
    } else {
      setHostDetailsState({ ...hostDetailsState, isVirtualWorkStation: false });
    }
  }, [distro]); // eslint-disable-line react-hooks/exhaustive-deps
  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  virtualWorkstationDistros = distros.filter((d) => d.isVirtualWorkStation);
  notVirtualWorkstationDistros = distros.filter((d) => !d.isVirtualWorkStation);

  const distroOptions = [
    {
      label: renderTitle("WORKSTATION DISTROS"),
      options: virtualWorkstationDistros.map((d) => renderItem(d.name)),
    },
    {
      label: renderTitle("OTHER DISTROS"),
      options: notVirtualWorkstationDistros.map((d) => renderItem(d.name)),
    },
  ];

  const spawnHostInput = prepareSpawnHostMutationVariables({
    hostDetailsState,
    awsRegion,
    distro,
    publicKeyState,
  });

  const spawnHost = (e) => {
    e.preventDefault();
    spawnHostMutation({ variables: { SpawnHostInput: spawnHostInput } });
  };

  return (
    <Modal
      title="Spawn New Host"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton onClick={onCancel} key="cancel_button">
          Cancel
        </WideButton>,
        <WideButton
          data-cy="spawn-host-button"
          disabled={!canSubmitSpawnHost(spawnHostInput) || loadingSpawnHost}
          onClick={spawnHost}
          variant={Variant.Primary}
          key="spawn_host_button"
          glyph={loadingSpawnHost && <Icon glyph="Refresh" />}
        >
          {loadingSpawnHost ? "Spawning Host" : "Spawn"}
        </WideButton>,
      ]}
      data-cy="spawn-host-modal"
    >
      <Container>
        <Subtitle> Required Host Information</Subtitle>
        <Section>
          <InputLabel htmlFor="distroSearchBox">Distro</InputLabel>
          <AutoComplete
            style={{ width: 200, marginLeft: 0 }}
            options={distroOptions}
            id="distroSearchBox"
            onChange={setDistro}
          >
            <Input
              value={distro}
              style={{ width: 200 }}
              placeholder="Search for Distro"
              suffix={<Icon glyph="MagnifyingGlass" />}
            />
          </AutoComplete>
        </Section>
        <Section>
          <InputLabel htmlFor="awsSelectDropown">Region</InputLabel>
          <Select
            id="awsSelectDropown"
            showSearch
            style={{ width: 200 }}
            placeholder="Select existing key"
            onChange={(v) => setAWSRegion(v)}
            value={awsRegion}
          >
            {awsRegions?.map((region) => (
              <Option value={region} key={`region_option_${region}`}>
                {region}
              </Option>
            ))}
          </Select>
        </Section>
        <Section>
          <PublicKeyForm
            publicKeys={publicKeys}
            data={publicKeyState}
            onChange={setPublicKeyState}
          />
        </Section>
        <HR />
        <Section>
          <HostDetailsForm
            data={hostDetailsState}
            onChange={setHostDetailsState}
            volumes={volumes}
            isSpawnHostModal
          />
        </Section>
      </Container>
    </Modal>
  );
};

const renderTitle = (title: string) => <b>{title}</b>;

const renderItem = (title: string) => ({
  value: title,
  label: <span key={`distro_${title}`}>{title}</span>,
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled(Container)`
  margin-top: 20px;
`;

const HR = styled("hr")`
  background-color: ${gray.light2};
  border: 0;
  height: 1px;
  width: 100%;
`;

const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;

const canSubmitSpawnHost = (spawnHostInput: SpawnHostInput): boolean => {
  if (
    spawnHostInput.distroId === "" ||
    spawnHostInput.region === "" ||
    spawnHostInput.publicKey.key === ""
  ) {
    return false;
  }
  return true;
};

const prepareSpawnHostMutationVariables = ({
  hostDetailsState,
  distro,
  awsRegion,
  publicKeyState,
}: {
  hostDetailsState: hostDetailsStateType;
  distro: string;
  awsRegion: string;
  publicKeyState: publicKeyStateType;
}): SpawnHostInput => {
  // Build out the mutationVariables
  const hostDetails = {
    ...hostDetailsState,
  };
  // Remove unnecessary fields from mutation
  if (!hostDetails.hasUserDataScript) {
    delete hostDetails.userDataScript;
  }
  if (hostDetails.volumeId === "") {
    delete hostDetails.volumeId;
  }
  if (hostDetails.homeVolumeSize === null) {
    delete hostDetails.homeVolumeSize;
  }
  delete hostDetails.hasUserDataScript;

  const result: SpawnHostInput = {
    ...hostDetails,
    ...omitTypename(publicKeyState),
    distroId: distro,
    region: awsRegion,
  };
  return result;
};
