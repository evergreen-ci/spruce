import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Form } from "components/Settings/Form";
import { GetFormSchema, ValidateProps } from "components/SpruceForm";
import { slugs } from "constants/routes";
import {
  UserDistroSettingsPermissionsQuery,
  UserDistroSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import { USER_DISTRO_SETTINGS_PERMISSIONS } from "gql/queries";
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
  const { [slugs.distroId]: distroId, [slugs.tab]: tab } = useParams<{
    [slugs.tab]: T;
    [slugs.distroId]: string;
  }>();
  const state = useDistroSettingsContext();
  usePopulateForm(initialFormState, tab);

  const { data } = useQuery<
    UserDistroSettingsPermissionsQuery,
    UserDistroSettingsPermissionsQueryVariables
  >(USER_DISTRO_SETTINGS_PERMISSIONS, {
    variables: { distroId },
  });
  const canEditDistro =
    data?.user?.permissions?.distroPermissions?.edit ?? false;

  return (
    <Form<WritableDistroSettingsType, FormStateMap>
      disabled={!canEditDistro}
      {...rest}
      state={state}
      tab={tab}
    />
  );
};
