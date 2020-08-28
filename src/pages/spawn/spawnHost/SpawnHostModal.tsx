import React, { useState } from "react";
import { Modal, AutoComplete, Input, Select } from "antd";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Subtitle, H2 } from "@leafygreen-ui/typography";
import Button, { Variant } from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "components/icons/Icon";
import { InputLabel } from "components/styles";
import { GET_DISTROS, GET_MY_PUBLIC_KEYS, GET_AWS_REGIONS } from "gql/queries";
import {
  DistrosQuery,
  DistrosQueryVariables,
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
} from "gql/generated/types";
import {
  PublicKeyForm,
  publicKeyStateType,
} from "./spawnHostModal/PublicKeyForm";
import {
  HostDetailsForm,
  hostDetailsStateType,
} from "./spawnHostModal/HostDetailsForm";

const { Option } = Select;
const { gray } = uiColors;

interface SpawnHostModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}
export const SpawnHostModal: React.FC<SpawnHostModalProps> = ({
  visible,
  onOk,
  onCancel,
}) => {
  const { data: distrosData, loading: distroLoading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(GET_DISTROS, {
    variables: {
      onlySpawnable: true,
    },
  });

  const { data: awsData, loading: awsLoading } = useQuery<
    AwsRegionsQuery,
    AwsRegionsQueryVariables
  >(GET_AWS_REGIONS);

  const { data: publicKeysData, loading: publicKeyLoading } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  const [publicKeyState, setPublicKeyState] = useState<publicKeyStateType>({
    publicKey: {
      name: "",
      key: "",
    },
    savePublicKey: false,
  });
  const [hostDetailsState, setHostDetailsState] = useState<
    hostDetailsStateType
  >({
    hasUserDataScript: false,
    userDataScript: "",
    expiration: new Date(),
    noExpiration: false,
  });
  const [distro, setDistro] = useState("");
  const [awsRegion, setAWSRegion] = useState("");

  if (distroLoading || publicKeyLoading || awsLoading) {
    return null;
  }

  const distros = distrosData?.distros;
  const publicKeys = publicKeysData?.myPublicKeys;
  const awsRegions = awsData?.awsRegions;
  return (
    <Modal
      title={<H2>Spawn New Host</H2>}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button onClick={onCancel}>Cancel</Button>,
        <Button
          data-cy="spawn-host-button"
          disabled={false}
          onClick={() => undefined}
          variant={Variant.Primary}
        >
          Restart
        </Button>,
      ]}
      width="50%"
      wrapProps={{
        "data-cy": "spawn-host-modal",
      }}
    >
      <Container>
        <Subtitle> Required Host Information</Subtitle>
        <Section>
          <InputLabel htmlFor="distroSearchBox">Distro</InputLabel>
          <AutoComplete
            style={{ width: 200, marginLeft: 0 }}
            options={distros?.map((d) => wrapOption(d.name))}
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
          />
        </Section>
      </Container>
    </Modal>
  );
};

// antd requires options to be in this format.
// For some reason something is preventing me from inlining this in the map statement above
const wrapOption = (str: string) => ({
  value: str,
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
