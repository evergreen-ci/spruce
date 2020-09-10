import React from "react";
import { useLocation } from "react-router";
import { SpawnTable } from "components/Spawn";
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
    <SpawnTable
      expandedRowRender={(record: Volume) => (
        <SpawnVolumeCard volume={record} />
      )}
      columns={columns}
      dataSource={volumes}
      defaultExpandedRowKeys={[volume as string]}
    />
  );
};
const columns = [];
