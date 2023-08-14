import { useMemo } from "react";
import { DistroSettingsTabRoutes } from "constants/routes";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = DistroSettingsTabRoutes.General;

export const GeneralTab: React.FC<TabProps> = ({ distroData }) => {
  const initialFormState = distroData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <BaseTab
      initialFormState={initialFormState}
      formSchema={formSchema}
      tab={tab}
    />
  );
};
