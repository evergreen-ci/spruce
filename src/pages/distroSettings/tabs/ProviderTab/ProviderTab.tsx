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
      <UnsavedModal
        distro={distro}
        shouldBlock={initialData?.provider !== formData?.provider?.providerName}
      />
      <BaseTab formSchema={formSchema} initialFormState={distroData} />
    </>
  );
};
