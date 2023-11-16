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
    setupAsSudo: boolean;
    setupScript: string;
    userSpawnAllowed: boolean;
    rootDir: string;
    isVirtualWorkStation: boolean;
    icecreamSchedulerHost: string;
    icecreamConfigPath: string;
    mountpoints: string[];
  };
  bootstrapSettings: {
    jasperBinaryDir: string;
    jasperCredentialsPath: string;
    clientDir: string;
    shellPath: string;
    serviceUser: string;
    homeVolumeFormatCommand: string;
    resourceLimits: {
      numFiles: number;
      numTasks: number;
      numProcesses: number;
      lockedMemoryKb: number;
      virtualMemoryKb: number;
    };
    env: Array<{
      key: string;
      value: string;
    }>;
    preconditionScripts: Array<{
      path: string;
      script: string;
    }>;
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
