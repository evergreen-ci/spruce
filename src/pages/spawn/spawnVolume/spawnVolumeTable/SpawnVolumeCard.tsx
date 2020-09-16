import React from "react";
import { MyVolumesQuery } from "gql/generated/types";

interface Props {
  volume: MyVolumesQuery["myVolumes"][0];
}
export const SpawnVolumeCard: React.FC<Props> = () => (
  <div>spawn volume card</div>
);
