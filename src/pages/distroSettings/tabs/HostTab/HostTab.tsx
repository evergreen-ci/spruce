import { useMemo } from "react";
import { DistroSettingsTabRoutes } from "constants/routes";
import { useSpruceConfig } from "hooks";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { HostFormState, TabProps } from "./types";

export const HostTab: React.FC<TabProps> = ({ distroData, provider }) => {
  const spruceConfig = useSpruceConfig();
  const sshKeys = spruceConfig?.keys;

  const { getTab } = useDistroSettingsContext();
  // @ts-expect-error - see TabState for details.
  const { formData }: { formData: HostFormState } = getTab(
    DistroSettingsTabRoutes.Host
  );
  const architecture = formData?.setup?.arch;

  const formSchema = useMemo(
    () => getFormSchema({ architecture, provider, sshKeys }),
    [architecture, provider, sshKeys]
  );

  return <BaseTab formSchema={formSchema} initialFormState={distroData} />;
};
