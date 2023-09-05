import { useMemo } from "react";
import { useSpruceConfig } from "hooks";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const HostTab: React.FC<TabProps> = ({ distroData, provider }) => {
  const spruceConfig = useSpruceConfig();
  const sshKeys = spruceConfig?.keys;

  const formSchema = useMemo(
    () => getFormSchema({ provider, sshKeys }),
    [provider, sshKeys]
  );

  return <BaseTab formSchema={formSchema} initialFormState={distroData} />;
};
