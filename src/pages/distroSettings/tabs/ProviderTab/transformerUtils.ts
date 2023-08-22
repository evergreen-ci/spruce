type FieldGetter = (providerSettings: Record<string, any>) => {
  form: Record<string, any>;
  gql: Record<string, any>;
};

const getUserData = ((providerSettings) => ({
  form: {
    userData: providerSettings.user_data ?? "",
  },
  gql: {
    user_data: providerSettings.userData,
  },
})) satisfies FieldGetter;

const getMergeUserData = ((providerSettings) => ({
  form: {
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
  },
  gql: {
    merge_user_data_parts: providerSettings.mergeUserData,
  },
})) satisfies FieldGetter;

const getSecurityGroups = ((providerSettings) => ({
  form: {
    securityGroups: providerSettings.security_group_ids ?? [],
  },
  gql: {
    security_group_ids: providerSettings.securityGroups,
  },
})) satisfies FieldGetter;

export const staticProviderSettings = ((providerSettings) => {
  const userData = getUserData(providerSettings);
  const mergeUserData = getMergeUserData(providerSettings);
  const securityGroups = getSecurityGroups(providerSettings);

  return {
    form: {
      providerSettings: {
        ...userData.form,
        ...mergeUserData.form,
        ...securityGroups.form,
      },
    },
    gql: {
      providerSettingsList: [
        {
          ...userData.gql,
          ...mergeUserData.gql,
          ...securityGroups.gql,
        },
      ],
    },
  };
}) satisfies FieldGetter;
