import { useQuery } from "@apollo/client";
import {
  DistrosQuery,
  DistrosQueryVariables,
  AwsRegionsQuery,
  AwsRegionsQueryVariables,
  UserSettingsQuery,
  MyPublicKeysQuery,
  MyPublicKeysQueryVariables,
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
import { getNoExpirationCheckboxTooltipCopy } from "../utils";

interface Props {
  host: { noExpiration: boolean };
}
export const useLoadFormSchemaData = (p?: Props) => {
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
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS);

  const spruceConfig = useSpruceConfig();

  const { data: userSettingsData } =
    useQuery<UserSettingsQuery>(GET_USER_SETTINGS);
  const { region: userAwsRegion } = userSettingsData?.userSettings ?? {};

  const { data: volumesData, loading: volumesLoading } = useQuery<
    MyVolumesQuery,
    MyHostsQueryVariables
  >(GET_MY_VOLUMES);

  const disableExpirationCheckbox = useDisableSpawnExpirationCheckbox(
    false,
    p?.host
  );
  const noExpirationCheckboxTooltip = getNoExpirationCheckboxTooltipCopy({
    disableExpirationCheckbox,
    isVolume: false,
    limit: spruceConfig?.spawnHost?.unexpirableHostsPerUser,
  });
  return {
    formSchemaInput: {
      awsRegions: awsData?.awsRegions,
      disableExpirationCheckbox,
      distros: distrosData?.distros,
      myPublicKeys: publicKeysData?.myPublicKeys,
      noExpirationCheckboxTooltip,
      userAwsRegion,
      volumes: volumesData?.myVolumes,
    },
    loading: distrosLoading || publicKeyLoading || awsLoading || volumesLoading,
  };
};
