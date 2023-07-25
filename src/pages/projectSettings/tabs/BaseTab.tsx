import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import { FormStateMap, WritableProjectSettingsType } from "./types";

type BaseTabProps<T extends WritableProjectSettingsType> = {
  disabled?: boolean;
  initialFormState: FormStateMap[T];
  formSchema: ReturnType<GetFormSchema>;
  tab: T;
  validate?: ValidateProps<FormStateMap[T]>;
};

export const BaseTab = <T extends WritableProjectSettingsType>({
  initialFormState,
  tab,
  ...rest
}: BaseTabProps<T>) => {
  const state = useProjectSettingsContext();
  usePopulateForm(initialFormState, tab);

  return (
    <Form<WritableProjectSettingsType, FormStateMap>
      {...rest}
      state={state}
      tab={tab}
    />
  );
};
