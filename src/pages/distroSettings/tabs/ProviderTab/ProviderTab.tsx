import { useMemo } from "react";
import { DistroSettingsTabRoutes } from "constants/routes";
import { useSpruceConfig } from "hooks";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { omitTypename } from "utils/string";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps, ProviderFormState } from "./types";

export const ProviderTab: React.FC<TabProps> = ({ distroData }) => {
  const { getTab } = useDistroSettingsContext();
  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: ProviderFormState } = getTab(
    DistroSettingsTabRoutes.Provider
  );

  const { containerPools } = useSpruceConfig();
  const { pools } = containerPools || {};

  const selectedPoolId = formData?.dockerProviderSettings?.containerPoolId;
  const selectedPool = pools?.find((p) => p.id === selectedPoolId) ?? null;
  const poolMappingInfo = selectedPool
    ? JSON.stringify(omitTypename(selectedPool), null, 4)
    : "";

  const formSchema = useMemo(
    () => getFormSchema({ pools: pools || [], poolMappingInfo }),
    [pools, poolMappingInfo]
  );

  return <BaseTab formSchema={formSchema} initialFormState={distroData} />;
};
