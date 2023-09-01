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

const getImageUrl = ((providerSettings) => ({
  form: {
    imageUrl: providerSettings.image_url ?? "",
  },
  gql: {
    image_url: providerSettings.imageUrl,
  },
})) satisfies FieldGetter;

const getBuildType = ((providerSettings) => ({
  form: {
    buildType: providerSettings.build_type ?? "",
  },
  gql: {
    build_type: providerSettings.buildType,
  },
})) satisfies FieldGetter;

const getRegistryUsername = ((providerSettings) => ({
  form: {
    registryUsername: providerSettings.docker_registry_user ?? "",
  },
  gql: {
    docker_registry_user: providerSettings.registryUsername,
  },
})) satisfies FieldGetter;

const getRegistryPassword = ((providerSettings) => ({
  form: {
    registryPassword: providerSettings.docker_registry_pw ?? "",
  },
  gql: {
    docker_registry_pw: providerSettings.registryPassword,
  },
})) satisfies FieldGetter;

export const staticProviderSettings = ((providerSettings = {}) => {
  const userData = getUserData(providerSettings);
  const mergeUserData = getMergeUserData(providerSettings);
  const securityGroups = getSecurityGroups(providerSettings);

  return {
    form: {
      ...userData.form,
      ...mergeUserData.form,
      ...securityGroups.form,
    },
    gql: [
      {
        ...userData.gql,
        ...mergeUserData.gql,
        ...securityGroups.gql,
      },
    ],
  };
}) satisfies FieldGetter;

export const dockerProviderSettings = ((providerSettings = {}) => {
  const imageUrl = getImageUrl(providerSettings);
  const buildType = getBuildType(providerSettings);
  const registryUser = getRegistryUsername(providerSettings);
  const registryPassword = getRegistryPassword(providerSettings);
  const userData = getUserData(providerSettings);
  const mergeUserData = getMergeUserData(providerSettings);
  const securityGroups = getSecurityGroups(providerSettings);

  return {
    form: {
      ...imageUrl.form,
      ...buildType.form,
      ...registryUser.form,
      ...registryPassword.form,
      ...userData.form,
      ...mergeUserData.form,
      ...securityGroups.form,
    },
    gql: [
      {
        ...imageUrl.gql,
        ...buildType.gql,
        ...registryUser.gql,
        ...registryPassword.gql,
        ...userData.gql,
        ...mergeUserData.gql,
        ...securityGroups.gql,
      },
    ],
  };
}) satisfies FieldGetter;
