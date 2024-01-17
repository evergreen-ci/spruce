import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { AwsRegionsQuery, AwsRegionsQueryVariables } from "gql/generated/types";
import { AWS_REGIONS } from "gql/queries";
import { useSpruceConfig } from "hooks";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { omitTypename } from "utils/string";
import { BaseTab } from "../BaseTab";
import {
  FormToGqlFunction,
  WritableDistroSettingsTabs,
  WritableDistroSettingsType,
} from "../types";
import { getFormSchema } from "./getFormSchema";
import { ProviderFormState, TabProps } from "./types";
import { UnsavedModal } from "./UnsavedModal";

export const ProviderTab: React.FC<TabProps> = ({ distro, distroData }) => {
  const { getTab } = useDistroSettingsContext();

  // @ts-expect-error - see TabState for details.
  const {
    formData,
    initialData,
  }: {
    formData: ProviderFormState;
    initialData: ReturnType<FormToGqlFunction<WritableDistroSettingsType>>;
  } = getTab(WritableDistroSettingsTabs.Provider);

  const { data: awsData } = useQuery<AwsRegionsQuery, AwsRegionsQueryVariables>(
    AWS_REGIONS,
  );
  const { awsRegions } = awsData || {};

  const spruceConfig = useSpruceConfig();
  const { pools } = spruceConfig?.containerPools || {};

  const selectedPoolId = formData?.dockerProviderSettings?.containerPoolId;
  const selectedPool = pools?.find((p) => p.id === selectedPoolId) ?? null;
  const poolMappingInfo = selectedPool
    ? JSON.stringify(omitTypename(selectedPool), null, 2)
    : "";

  const fleetRegionsInUse = formData?.ec2FleetProviderSettings?.map(
    (p) => p.region,
  );
  const onDemandRegionsInUse = formData?.ec2OnDemandProviderSettings?.map(
    (p) => p.region,
  );

  const formSchema = useMemo(
    () =>
      getFormSchema({
        awsRegions: awsRegions || [],
        fleetRegionsInUse: fleetRegionsInUse || [],
        onDemandRegionsInUse: onDemandRegionsInUse || [],
        pools: pools || [],
        poolMappingInfo,
      }),
    [
      awsRegions,
      fleetRegionsInUse,
      onDemandRegionsInUse,
      pools,
      poolMappingInfo,
    ],
  );

  return (
    <>
      {/* Use conditional rendering instead of the shouldBlock prop so that modifying fields other than the provider triggers the standard navigation warning modal */}
      {initialData?.provider !== formData?.provider?.providerName && (
        <UnsavedModal distro={distro} shouldBlock />
      )}
      <BaseTab formSchema={formSchema} initialFormState={distroData} />
    </>
  );
};
