import { useQuery } from "@apollo/client";
import {
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
  InstanceTypesQuery,
  InstanceTypesQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import { INSTANCE_TYPES, MY_PUBLIC_KEYS, MY_VOLUMES } from "gql/queries";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { MyHost } from "types/spawn";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormData = (host: MyHost) => {
  // QUERY instance_types
  const { data: instanceTypesData } = useQuery<
    InstanceTypesQuery,
    InstanceTypesQueryVariables
  >(INSTANCE_TYPES);

  // QUERY volumes
  const { data: volumesData } = useQuery<
    MyVolumesQuery,
    MyVolumesQueryVariables
  >(MY_VOLUMES);

  // QUERY public keys
  const { data: publicKeysData } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(MY_PUBLIC_KEYS);

  const spruceConfig = useSpruceConfig();

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    false,
    host,
  );

  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: false,
  });

  return {
    instanceTypesData,
    volumesData,
    publicKeysData,
    disableExpirationCheckbox,
    noExpirationCheckboxTooltip,
  };
};
