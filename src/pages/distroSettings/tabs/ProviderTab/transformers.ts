import { DistroSettingsTabRoutes } from "constants/routes";
import { Provider } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Provider;

const getUserData = (providerSettings: any) => ({
  userData: providerSettings.user_data ?? "",
});

const getMergeUserData = (providerSettings: any) => ({
  userData: providerSettings.merge_user_data_parts ?? false,
});

const getSecurityGroups = (providerSettings: any) => ({
  securityGroups: providerSettings.security_group_ids ?? [],
});

const staticProviderSettings = (providerSettings: any) => ({
  providerSettings: {
    ...getUserData(providerSettings),
    ...getMergeUserData(providerSettings),
    ...getSecurityGroups(providerSettings),
  },
});

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { provider, providerSettingsList } = data;

  switch (provider) {
    case Provider.Static:
    default:
      return {
        provider,
        ...staticProviderSettings(providerSettingsList[0]),
      };
  }
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((data, distro) => {
  const { provider } = data;

  switch (provider) {
    case Provider.Static:
    default: {
      const { mergeUserData, securityGroups, userData } = data.providerSettings;
      return {
        ...distro,
        providerSettingsList: [
          {
            merge_user_data_parts: mergeUserData,
            security_group_ids: securityGroups,
            user_data: userData,
          },
        ],
      };
    }
  }
}) satisfies FormToGqlFunction<Tab>;
