import { useMemo } from "react";
import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";
import { DeleteDistro } from "pages/distroSettings/DeleteDistro";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

export const GeneralTab: React.FC<TabProps> = ({ distroData }) => {
  const initialFormState = distroData;

  const formSchema = useMemo(() => getFormSchema(), []);

  return (
    <>
      <BaseTab formSchema={formSchema} initialFormState={initialFormState} />
      <SettingsCardTitle>Remove Configuration</SettingsCardTitle>
      <SettingsCard>
        <DeleteDistro />
      </SettingsCard>
    </>
  );
};
