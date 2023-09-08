import { useMemo } from "react";
import { useDistroSettingsContext } from "../../Context";
import { BaseTab } from "../BaseTab";
import { WritableDistroSettingsTabs } from "../types";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";
import { UnsavedModal } from "./UnsavedModal";

export const ProviderTab: React.FC<TabProps> = ({ distro, distroData }) => {
  const formSchema = useMemo(() => getFormSchema(), []);

  const { getTab } = useDistroSettingsContext();
  const { formData, initialData } = getTab(WritableDistroSettingsTabs.Provider);

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
