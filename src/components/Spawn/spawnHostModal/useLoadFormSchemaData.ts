import { useQuery } from "@apollo/client";
import {
  DistrosQuery,
  DistrosQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  GetUserSettingsQuery,
  GetMyPublicKeysQuery,
  GetMyPublicKeysQueryVariables,
  MyVolumesQuery,
  MyHostsQueryVariables,
} from "gql/generated/types";
import {
  GET_DISTROS,
  GET_AWS_REGIONS,
  GET_USER_SETTINGS,
  GET_MY_PUBLIC_KEYS,
  GET_MY_VOLUMES,
} from "gql/queries";
import { useDisableSpawnExpirationCheckbox, useSpruceConfig } from "hooks";
import { useUserTimeZone } from "hooks/useUserTimeZone";
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

export const useLoadFormSchemaData = () => {
  const { data: awsData, loading: awsLoading } = useQuery<
    AwsRegionsQuery,
    AwsRegionsQueryVariables
  >(GET_AWS_REGIONS);

  const { data: distrosData, loading: distrosLoading } = useQuery<
    DistrosQuery,
    DistrosQueryVariables
  >(GET_DISTROS, {
    variables: {
      onlySpawnable: true,
    },
  });

  const { data: publicKeysData, loading: publicKeyLoading } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  const spruceConfig = useSpruceConfig();

  const { data: userSettingsData } =
    useQuery<GetUserSettingsQuery>(GET_USER_SETTINGS);
  const { region: userAwsRegion } = userSettingsData?.userSettings ?? {};

  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(GET_MY_VOLUMES);

  const timezone = useUserTimeZone();

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(false);
  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
    isVolume: false,
  });
  return {
    formSchemaInput: {
      awsRegions: awsData?.awsRegions,
      disableExpirationCheckbox,
      distros: distrosData?.distros,
      myPublicKeys: publicKeysData?.myPublicKeys,
      noExpirationCheckboxTooltip,
      timezone,
      userAwsRegion,
      volumes: volumesData?.myVolumes,
    },
    loading: distrosLoading || publicKeyLoading || awsLoading || volumesLoading,
  };
};
