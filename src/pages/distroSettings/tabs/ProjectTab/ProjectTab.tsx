import { useMemo } from "react";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const ProjectTab: React.FC<TabProps> = ({ distroData }) => {
  const initialFormState = distroData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <BaseTab formSchema={formSchema} initialFormState={initialFormState} />
  );
};
