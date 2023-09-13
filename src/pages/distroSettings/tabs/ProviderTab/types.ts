import { Provider } from "gql/generated/types";

export enum BuildType {
  Import = "import",
  Pull = "pull",
}

// TODO: Append type with additional provider options, e.g. type ProviderFormState = StaticProviderFormState | DockerProviderFormState
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
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
};

export type TabProps = {
  distroData: ProviderFormState;
};
