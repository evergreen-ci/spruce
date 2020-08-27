import React from "react";
import { Modal, AutoComplete, Input } from "antd";
import { useQuery } from "@apollo/client";
import { Subtitle, H2 } from "@leafygreen-ui/typography";
import Button, { Variant } from "@leafygreen-ui/button";
import Icon from "components/icons/Icon";
import { GET_DISTROS } from "gql/queries";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";

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

  const distros = distrosData?.distros;
  if (distroLoading) {
    return <>Loading...</>;
  }
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
      <Subtitle> Required Host Information</Subtitle>
      <AutoComplete
        style={{ width: 200, marginLeft: 0 }}
        dataSource={distros?.map((d) => d.name)}
      >
        <Input
          style={{ width: 200 }}
          placeholder="Search for Distro"
          suffix={<Icon glyph="MagnifyingGlass" />}
        />
      </AutoComplete>
    </Modal>
  );
};
