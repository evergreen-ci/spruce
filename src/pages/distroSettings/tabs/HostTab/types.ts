import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  FeedbackRule,
  HostAllocatorVersion,
  OverallocatedRule,
  Provider,
  RoundingRule,
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
    version: HostAllocatorVersion;
    roundingRule: RoundingRule;
    feedbackRule: FeedbackRule;
    hostsOverallocatedRule: OverallocatedRule;
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
