import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { AutoComplete, Input } from "antd";
import Icon from "components/icons/Icon";
import { Modal } from "components/Modal";
import { RegionSelector } from "components/Spawn";
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
  PublicKeyForm,
  publicKeyStateType,
  useSpawnHostModalState,
} from "./spawnHostModal/index";

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
    onCompleted(hostMutation) {
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

  const [distroInput, setDistroInput] = useState("");
  const { reducer } = useSpawnHostModalState();
  const [spawnHostModalState, dispatch] = reducer;

  const { distroId, region, publicKey } = spawnHostModalState;

  const fetchedDistros = distrosData?.distros;
  const publicKeys = publicKeysData?.myPublicKeys;
  const awsRegions = awsData?.awsRegions;
  const volumes = volumesData?.myVolumes;

  useEffect(() => {
    dispatch({ type: "reset" });
    if (awsRegions) {
      dispatch({ type: "editAWSRegion", region: awsRegions[0] });
    }
    if (publicKeys) {
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
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Need to initialize these here so they can be used in the useEffect hook
  let virtualWorkstationDistros = [];
  let notVirtualWorkstationDistros = [];

  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  const distros = fetchedDistros.filter((d) => d.name.includes(distroInput));
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

  const canSubmitSpawnHost = !(
    distroId === "" ||
    region === "" ||
    publicKey.key === ""
  );

  const spawnHost = (e) => {
    e.preventDefault();
    spawnHostMutation({
      variables: { SpawnHostInput: omitTypename({ ...spawnHostModalState }) },
    });
  };

  const editDistro = (d: string) => {
    dispatch({
      type: "editDistro",
      distroId: d,
      isVirtualWorkstation: !!virtualWorkstationDistros.find(
        (vd) => d === vd.name
      ),
    });
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
          disabled={!canSubmitSpawnHost || loadingSpawnHost}
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
            onChange={editDistro}
            value={distroId}
          >
            <Input
              value={distroId}
              style={{ width: 200 }}
              placeholder="Search for Distro"
              suffix={<Icon glyph="MagnifyingGlass" />}
              data-cy="distro-input"
              onChange={(e) => setDistroInput(e.target.value)}
            />
          </AutoComplete>
        </Section>
        <RegionSelector
          onChange={(v) => dispatch({ type: "editAWSRegion", region: v })}
          selectedRegion={spawnHostModalState.region}
          awsRegions={awsRegions}
        />
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
        <Section>
          <HostDetailsForm
            data={spawnHostModalState}
            onChange={dispatch}
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
