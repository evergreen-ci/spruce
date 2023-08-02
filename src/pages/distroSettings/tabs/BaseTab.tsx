import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { usePopulateForm, useDistroSettingsContext } from "../Context";
import { FormStateMap, WritableDistroSettingsType } from "./types";

type BaseTabProps<T extends WritableDistroSettingsType> = {
  disabled?: boolean;
  initialFormState: FormStateMap[T];
  formSchema: ReturnType<GetFormSchema>;
  tab: T;
  validate?: ValidateProps<FormStateMap[T]>;
};

export const BaseTab = <T extends WritableDistroSettingsType>({
  initialFormState,
  tab,
  ...rest
}: BaseTabProps<T>) => {
  const state = useDistroSettingsContext();
  usePopulateForm(initialFormState, tab);

  return (
    <Form<WritableDistroSettingsType, FormStateMap>
      {...rest}
      state={state}
      tab={tab}
    />
  );
};
