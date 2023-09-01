import { Provider } from "gql/generated/types";

export enum BuildType {
  Import = "import",
  Pull = "pull",
}

interface StaticProviderFormState {
  provider: {
    providerName: Provider.Static;
  };
  providerSettings: {
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
}

interface DockerProviderFormState {
  provider: {
    providerName: Provider.Docker;
  };
  providerSettings: {
    imageUrl: string;
    buildType: BuildType;
    registryUsername: string;
    registryPassword: string;
    containerPoolId: string;
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
}

// TODO: Append type with additional provider options, e.g. type ProviderFormState = StaticProviderFormState | DockerProviderFormState
export type ProviderFormState =
  | StaticProviderFormState
  | DockerProviderFormState;

export type TabProps = {
  distroData: ProviderFormState;
};
