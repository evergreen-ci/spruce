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

  switch (provider) {
    case Provider.Static:
      return {
        provider: {
          providerName: Provider.Static,
        },
        providerSettings: {
          ...staticProviderSettings(providerSettingsList[0]).form,
        },
      };
    case Provider.Docker:
      return {
        provider: {
          providerName: Provider.Docker,
        },
        providerSettings: {
          ...dockerProviderSettings(providerSettingsList[0]).form,
          containerPoolId: containerPool,
        },
      };
    default:
      throw new Error(`Unknown provider '${provider}'`);
  }
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
          ...staticProviderSettings(data.providerSettings).gql,
        ],
      };
    case Provider.Docker:
      return {
        ...distro,
        provider: Provider.Docker,
        providerSettingsList: [
          ...dockerProviderSettings(data.providerSettings).gql,
        ],
        // @ts-ignore-error - containerPoolId will exist in DockerFormState.
        containerPool: data.providerSettings.containerPoolId,
      };
    default:
      return distro;
  }
}) satisfies FormToGqlFunction<Tab>;
