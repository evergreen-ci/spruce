import { DistroSettingsTabRoutes } from "constants/routes";
import { Provider } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { gqlProviderSettings, formProviderSettings } from "./transformerUtils";

type Tab = DistroSettingsTabRoutes.Provider;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { containerPool, provider, providerSettingsList } = data;

  return {
    provider: {
      providerName: provider,
    },
    staticProviderSettings: {
      ...formProviderSettings(providerSettingsList[0]).staticProviderSettings,
    },
    dockerProviderSettings: {
      ...formProviderSettings(providerSettingsList[0]).dockerProviderSettings,
      containerPoolId: containerPool,
      poolMappingInfo: "",
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = ((data, distro) => {
  const {
    provider: { providerName },
  } = data;

  switch (providerName) {
    case Provider.Static:
      return {
        ...distro,
        provider: Provider.Static,
        providerSettingsList: [
          {
            ...gqlProviderSettings(data.staticProviderSettings)
              .staticProviderSettings,
          },
        ],
        containerPool: "",
      };
    case Provider.Docker:
      return {
        ...distro,
        provider: Provider.Docker,
        providerSettingsList: [
          {
            ...gqlProviderSettings(data.dockerProviderSettings)
              .dockerProviderSettings,
          },
        ],
        containerPool: data.dockerProviderSettings.containerPoolId,
      };
    default:
      return distro;
  }
}) satisfies FormToGqlFunction<Tab>;
