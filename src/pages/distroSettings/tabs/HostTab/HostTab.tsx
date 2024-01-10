import { useMemo } from "react";
import { ValidateProps } from "components/SpruceForm";
import { DistroSettingsTabRoutes } from "constants/routes";
import { BootstrapMethod, CommunicationMethod } from "gql/generated/types";
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
    DistroSettingsTabRoutes.Host,
  );
  const architecture = formData?.setup?.arch;

  const formSchema = useMemo(
    () => getFormSchema({ architecture, provider, sshKeys }),
    [architecture, provider, sshKeys],
  );

  return (
    <BaseTab
      formSchema={formSchema}
      initialFormState={distroData}
      validate={validate}
    />
  );
};

const validate = ((formData, errors) => {
  const {
    setup: { bootstrapMethod, communicationMethod },
  } = formData;

  // Ensure either Legacy SSH or non-legacy methods are used for both communication and bootstrapping.
  if (
    (bootstrapMethod === BootstrapMethod.LegacySsh &&
      communicationMethod !== CommunicationMethod.LegacySsh) ||
    (bootstrapMethod !== BootstrapMethod.LegacySsh &&
      communicationMethod === CommunicationMethod.LegacySsh)
  ) {
    errors.setup.communicationMethod.addError(
      "Legacy and non-legacy bootstrapping and communication are incompatible.",
    );
  }

  return errors;
}) satisfies ValidateProps<HostFormState>;
