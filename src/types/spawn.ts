import { MyVolumesQuery, MyHostsQuery } from "gql/generated/types";

export type MyVolume = MyVolumesQuery["myVolumes"][0];

export type MyHost = MyHostsQuery["myHosts"][0];
