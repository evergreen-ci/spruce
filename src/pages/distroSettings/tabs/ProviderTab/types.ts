import { Provider } from "gql/generated/types";

export enum BuildType {
  Import = "import",
  Pull = "pull",
}

export type ProviderFormState = {
  provider: {
    providerName: Provider;
  };
  staticProviderSettings: {
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
  dockerProviderSettings: {
    imageUrl: string;
    buildType: BuildType;
    registryUsername: string;
    registryPassword: string;
    containerPoolId: string;
    poolMappingInfo: string;
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
};

export type TabProps = {
  distroData: ProviderFormState;
};
