import { useParams } from "react-router-dom";
import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { usePopulateForm, useDistroSettingsContext } from "../Context";
import { FormStateMap, WritableDistroSettingsType } from "./types";

type BaseTabProps<T extends WritableDistroSettingsType> = {
  disabled?: boolean;
  formSchema: ReturnType<GetFormSchema>;
  initialFormState: FormStateMap[T];
  validate?: ValidateProps<FormStateMap[T]>;
};

export const BaseTab = <T extends WritableDistroSettingsType>({
  initialFormState,
  ...rest
}: BaseTabProps<T>) => {
  const { tab } = useParams<{ tab: T }>();
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
