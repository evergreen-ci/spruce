import { Form } from "components/Settings/Form";
import { ValidateProps } from "components/SpruceForm";
import { usePopulateForm, useProjectSettingsContext } from "../Context";
import {
  FormStateMap,
  GetFormSchema,
  WritableProjectSettingsType,
} from "./types";

type BaseTabProps<T extends WritableProjectSettingsType> = {
  initialFormState: FormStateMap[T];
  formSchema: ReturnType<GetFormSchema>;
  tab: T;
  validate?: ValidateProps<FormStateMap[T]>;
};

export const BaseTab = <T extends WritableProjectSettingsType>({
  initialFormState,
  formSchema,
  tab,
  validate,
}: BaseTabProps<T>) => {
  const state = useProjectSettingsContext();
  usePopulateForm(initialFormState, tab);
  return (
    <Form<WritableProjectSettingsType, FormStateMap>
      formSchema={formSchema}
      state={state}
      tab={tab}
      validate={validate}
    />
  );
};
