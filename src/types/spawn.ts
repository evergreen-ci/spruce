import { MyVolumesQuery } from "gql/generated/types";

export type MyVolume = MyVolumesQuery["myVolumes"][0];
