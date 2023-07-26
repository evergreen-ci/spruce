import { useQuery } from "@apollo/client";
import {
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import {
  GET_INSTANCE_TYPES,
  GET_MY_PUBLIC_KEYS,
  GET_MY_VOLUMES,
} from "gql/queries";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { MyHost } from "types/spawn";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = (host: MyHost) => {
  // QUERY get_instance_types
  const { data: instanceTypesData } = useQuery<
    InstanceTypesQuery,
    InstanceTypesQueryVariables
  >(GET_INSTANCE_TYPES);

  // QUERY volumes
  const { data: volumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(GET_MY_VOLUMES);

  // QUERY public keys
  const { data: publicKeysData } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  const spruceConfig = useSpruceConfig();

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    false,
    host
  );

  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    isVolume: false,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
  });

  return {
    disableExpirationCheckbox,
    instanceTypesData,
    noExpirationCheckboxTooltip,
    publicKeysData,
    volumesData,
  };
};
