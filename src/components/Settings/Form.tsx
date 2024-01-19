import {
  SpruceForm,
  ValidateProps,
  GetFormSchema,
} from "components/SpruceForm";
import { SettingsState } from "./Context";
import { SettingsRoutes } from "./types";

export type FormProps<
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
> = {
  disabled?: boolean;
  formSchema: ReturnType<GetFormSchema>;
  state: SettingsState<T, FormStateMap>;
  tab: T;
  validate?: ValidateProps<FormStateMap[T]>;
};

export const Form = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>({
  disabled,
  formSchema,
  state,
  tab,
  validate,
}: FormProps<T, FormStateMap>) => {
  const { getTab, updateForm } = state;
  const { formData } = getTab(tab);
  const { fields, schema, uiSchema } = formSchema;

  if (!formData) return null;

  return (
    <SpruceForm
      disabled={disabled}
      fields={fields}
      formData={formData}
      onChange={updateForm(tab)}
      schema={schema}
      uiSchema={uiSchema}
      validate={validate as any}
    />
  );
};
