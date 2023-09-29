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
    ec2FleetProviderSettings: providerSettingsList.map((p) => ({
      ...formProviderSettings(p).ec2FleetProviderSettings,
      displayTitle: p.region,
    })),
    ec2OnDemandProviderSettings: providerSettingsList.map((p) => ({
      ...formProviderSettings(p).ec2OnDemandProviderSettings,
      displayTitle: p.region,
    })),
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
    case Provider.Ec2Fleet:
      return {
        ...distro,
        provider: Provider.Ec2Fleet,
        providerSettingsList: data.ec2FleetProviderSettings.map((p) => ({
          ...gqlProviderSettings(p).ec2FleetProviderSettings,
        })),
        containerPool: "",
      };
    case Provider.Ec2OnDemand:
      return {
        ...distro,
        provider: Provider.Ec2OnDemand,
        providerSettingsList: data.ec2OnDemandProviderSettings.map((p) => ({
          ...gqlProviderSettings(p).ec2OnDemandProviderSettings,
        })),
        containerPool: "",
      };
    default:
      return distro;
  }
}) satisfies FormToGqlFunction<Tab>;
