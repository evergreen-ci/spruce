import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  Provider,
} from "gql/generated/types";

export interface HostFormState {
  setup: {
    bootstrapMethod: BootstrapMethod;
    communicationMethod: CommunicationMethod;
    arch: Arch;
    workDir: string;
    setupScript: string;
    setupAsSudo: boolean;
  };
  sshConfig: {
    user: string;
    sshKey: string;
    authorizedKeysFile: string;
    sshOptions: string[];
  };
  allocation: {
    // TODO: Replace next 4 with enums.
    version: string;
    roundingRule: string;
    feedbackRule: string;
    hostsOverallocatedRule: string;
    minimumHosts: number;
    maximumHosts: number;
    acceptableHostIdleTime: number;
    futureHostFraction: number;
  };
}

export type TabProps = {
  distroData: HostFormState;
  provider: Provider;
};
