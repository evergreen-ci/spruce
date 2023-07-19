import { SpruceForm, ValidateProps } from "components/SpruceForm";
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
  const { getTab, updateForm } = useProjectSettingsContext();
  const { formData } = getTab(tab);

  usePopulateForm(initialFormState, tab);

  const onChange = updateForm(tab);

  const { fields, schema, uiSchema } = formSchema;
  if (!formData) return null;

  return (
    <SpruceForm
      fields={fields}
      formData={formData}
      onChange={onChange}
      schema={schema}
      uiSchema={uiSchema}
      validate={validate as any}
    />
  );
};
