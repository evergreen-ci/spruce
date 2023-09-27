import { useMemo } from "react";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const TaskTab: React.FC<TabProps> = ({ distroData, provider }) => {
  const formSchema = useMemo(() => getFormSchema({ provider }), [provider]);

  return <BaseTab formSchema={formSchema} initialFormState={distroData} />;
};
