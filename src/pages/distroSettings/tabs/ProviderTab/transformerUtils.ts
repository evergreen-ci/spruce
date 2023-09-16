import { BuildType, ProviderFormState } from "./types";

interface ProviderSettingsList {
  user_data: string;
  merge_user_data_parts: boolean;
  security_group_ids: string[];
  image_url: string;
  build_type: string;
  docker_registry_user: string;
  docker_registry_pw: string;
}

export const formProviderSettings = (
  providerSettings: Partial<ProviderSettingsList>
) => ({
  staticProviderSettings: {
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
  },
  dockerProviderSettings: {
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    imageUrl: providerSettings.image_url ?? "",
    buildType: (providerSettings.build_type ?? "") as BuildType,
    registryUsername: providerSettings.docker_registry_user ?? "",
    registryPassword: providerSettings.docker_registry_pw ?? "",
  },
});

type ProviderSettings = ProviderFormState["staticProviderSettings"] &
  ProviderFormState["dockerProviderSettings"];

export const gqlProviderSettings = (
  providerSettings: Partial<ProviderSettings>
) => ({
  staticProviderSettings: {
    user_data: providerSettings.userData,
    merge_user_data_parts: providerSettings.mergeUserData,
    security_group_ids: providerSettings.securityGroups,
  },
  dockerProviderSettings: {
    user_data: providerSettings.userData,
    merge_user_data_parts: providerSettings.mergeUserData,
    security_group_ids: providerSettings.securityGroups,
    image_url: providerSettings.imageUrl,
    build_type: providerSettings.buildType,
    docker_registry_user: providerSettings.registryUsername,
    docker_registry_pw: providerSettings.registryPassword,
  },
});
