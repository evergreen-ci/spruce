import { MyVolumesQuery, MyHostsQuery } from "gql/generated/types";

export type MyVolume = MyVolumesQuery["myVolumes"][0];
export interface TableVolume extends MyVolume {
  showMigrateBtnCue: boolean;
}
export type MyHost = MyHostsQuery["myHosts"][0];
