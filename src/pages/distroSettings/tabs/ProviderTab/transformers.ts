import { DistroSettingsTabRoutes } from "constants/routes";
import { Provider } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import {
  staticProviderSettings,
  dockerProviderSettings,
} from "./transformerUtils";

type Tab = DistroSettingsTabRoutes.Provider;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { containerPool, provider, providerSettingsList } = data;

  return {
    provider: {
      providerName: provider,
    },
    staticProviderSettings: {
      ...staticProviderSettings(providerSettingsList[0]).form,
    },
    dockerProviderSettings: {
      ...dockerProviderSettings(providerSettingsList[0]).form,
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
            ...staticProviderSettings(data.staticProviderSettings).gql,
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
            ...dockerProviderSettings(data.dockerProviderSettings).gql,
          },
        ],
        containerPool: data.dockerProviderSettings.containerPoolId,
      };
    default:
      return distro;
  }
}) satisfies FormToGqlFunction<Tab>;
