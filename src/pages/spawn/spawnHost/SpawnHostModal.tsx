import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { AutoComplete, Input, Select } from "antd";
import Icon from "components/icons/Icon";
import { Modal } from "components/Modal";
import { InputLabel } from "components/styles";
import {
  DistrosQuery,
  DistrosQueryVariables,
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import {
  GET_DISTROS,
  GET_MY_PUBLIC_KEYS,
  GET_AWS_REGIONS,
  GET_MY_VOLUMES,
} from "gql/queries";
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
  onOk: () => void;
  onCancel: () => void;
}
export const SpawnHostModal: React.FC<SpawnHostModalProps> = ({
  visible,
  onCancel,
}) => {
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
    volume: "",
    isVirtualWorkstation: false,
  });

  // distro Field for form submision
  const [distro, setDistro] = useState("");
  // aws region field for form submission
  const [awsRegion, setAWSRegion] = useState("");

  // Need to initialize these here so they can be used in the useEffect hook
  let virtualWorkstationDistros = [];
  let notVirtualWorkstationDistros = [];

  useEffect(() => {
    if (virtualWorkstationDistros.find((vd) => distro === vd.name)) {
      setHostDetailsState({ ...hostDetailsState, isVirtualWorkstation: true });
    } else {
      setHostDetailsState({ ...hostDetailsState, isVirtualWorkstation: false });
    }
  }, [distro]); // eslint-disable-line react-hooks/exhaustive-deps
  if (distroLoading || publicKeyLoading || awsLoading || volumesLoading) {
    return null;
  }

  const distros = distrosData?.distros;
  const publicKeys = publicKeysData?.myPublicKeys;
  const awsRegions = awsData?.awsRegions;
  const volumes = volumesData?.myVolumes;

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
  return (
    <Modal
      title="Spawn New Host"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <WideButton onClick={onCancel}>Cancel</WideButton>,
        <WideButton
          data-cy="spawn-host-button"
          disabled={false}
          onClick={() => undefined}
          variant={Variant.Primary}
        >
          Spawn
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
          />
        </Section>
      </Container>
    </Modal>
  );
};

const renderTitle = (title: string) => <b>{title}</b>;

const renderItem = (title: string) => ({
  value: title,
  label: <span>{title}</span>,
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
