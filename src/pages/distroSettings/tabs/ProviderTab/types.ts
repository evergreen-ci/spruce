import { Provider } from "gql/generated/types";

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

// TODO: Append type with additional provider options, e.g. type ProviderFormState = StaticProviderFormState | DockerProviderFormState
export type ProviderFormState = StaticProviderFormState;

export type TabProps = {
  distroData: ProviderFormState;
};
