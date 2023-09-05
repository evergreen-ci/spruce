import { DistroSettingsTabRoutes } from "constants/routes";
import { Provider } from "gql/generated/types";
import { FormToGqlFunction, GqlToFormFunction } from "../types";
import { staticProviderSettings } from "./transformerUtils";

type Tab = DistroSettingsTabRoutes.Provider;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const { provider, providerSettingsList } = data;

  switch (provider) {
    case Provider.Static:
      return {
        provider: {
          providerName: Provider.Static,
        },
        ...staticProviderSettings(providerSettingsList[0]).form,
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
    case Provider.Static: {
      return {
        ...distro,
        provider: providerName,
        ...staticProviderSettings(data.providerSettings).gql,
      };
    }
    default:
      return distro;
  }
}) satisfies FormToGqlFunction<Tab>;
