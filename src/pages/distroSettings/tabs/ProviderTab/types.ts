import { Provider } from "gql/generated/types";

interface StaticProviderFormState {
  provider: {
    providerName: Provider;
  };
  providerSettings: {
    userData: string;
    mergeUserData: boolean;
    securityGroups: string[];
  };
}

export type ProviderFormState = StaticProviderFormState;

export type TabProps = {
  distroData: ProviderFormState;
};
