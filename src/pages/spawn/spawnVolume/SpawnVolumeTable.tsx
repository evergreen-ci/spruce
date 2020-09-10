import React from "react";
import styled from "@emotion/styled";
import { Table } from "antd";
import { useLocation } from "react-router";
import Icon from "components/icons/Icon";
import { Volume } from "gql/generated/types";
import { SpawnVolumeCard } from "pages/spawn/spawnVolume/spawnVolumeTable/SpawnVolumeCard";
import { parseQueryString } from "utils";

interface SpawnVolumeTableProps {
  volumes: Volume[];
}

export const SpawnHostTable: React.FC<SpawnVolumeTableProps> = ({
  volumes,
}) => {
  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const volume = queryParams?.volume;
  return (
    <Container>
      <Table
        rowKey={(record) => record.id}
        pagination={false}
        expandRowByClick
        expandIcon={({ expanded }) => (
          <Icon glyph={expanded ? "CaretDown" : "CaretRight"} />
        )}
        expandedRowRender={(record: Volume) => (
          <SpawnVolumeCard volume={record} />
        )}
        columns={columns}
        dataSource={volumes}
        defaultExpandedRowKeys={[volume as string]}
      />
    </Container>
  );
};
const columns = [];

const Container = styled.div`
  width: 100%;
  padding-right: 1%;
`;
