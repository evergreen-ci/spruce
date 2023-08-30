import { useMemo } from "react";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const HostTab: React.FC<TabProps> = ({ distroData, provider }) => {
  const initialFormState = distroData;

  const formSchema = useMemo(() => getFormSchema({ provider }), [provider]);

  return (
    <BaseTab formSchema={formSchema} initialFormState={initialFormState} />
  );
};
