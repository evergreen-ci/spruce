import { useMemo } from "react";
import { DistroSettingsTabRoutes } from "constants/routes";
import { useDistroSettingsContext } from "pages/distroSettings/Context";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps, TaskFormState } from "./types";

const tab = DistroSettingsTabRoutes.Task;

export const TaskTab: React.FC<TabProps> = ({ distroData }) => {
  const { getTab } = useDistroSettingsContext();
  const tabData = getTab(tab);
  const { formData } = tabData;
  const plannerVersion = (formData as TaskFormState)?.plannerSettings?.version;

  const initialFormState = distroData;

  const formSchema = useMemo(
    () => getFormSchema({ plannerVersion }),
    [plannerVersion]
  );

  return (
    <BaseTab formSchema={formSchema} initialFormState={initialFormState} />
  );
};
