import {
  CloneMethod,
  DistroQuery,
  FinderVersion,
  PlannerVersion,
  DispatcherVersion,
} from "gql/generated/types";

const distroData: DistroQuery["distro"] = {
  __typename: "Distro",
  aliases: ["rhel71-power8", "rhel71-power8-build"],
  arch: "linux_ppc64le",
  authorizedKeysFile: "",
  bootstrapSettings: {
    clientDir: "/home/evg/client",
    communication: "legacy-ssh",
    env: [
      {
        key: "foo",
        value: "bar",
      },
    ],
    jasperBinaryDir: "/home/evg/jasper",
    jasperCredentialsPath: "/home/evg/jasper/creds.json",
    method: "legacy-ssh",
    preconditionScripts: [],
    resourceLimits: {
      lockedMemoryKb: -1,
      numFiles: 64000,
      numProcesses: -1,
      numTasks: 0,
      virtualMemoryKb: -1,
    },
    rootDir: "",
    serviceUser: "",
    shellPath: "/bin/bash",
  },
  cloneMethod: CloneMethod.LegacySsh,
  containerPool: "",
  disabled: false,
  disableShallowClone: true,
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
  expansions: [
    {
      key: "decompress",
      value: "tar xzvf",
    },
    {
      key: "ps",
      value: "ps aux",
    },
    {
      key: "kill_pid",
      value: "kill -- -$(ps opgid= %v)",
    },
  ],
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  homeVolumeSettings: {
    formatCommand: "",
  },
  hostAllocatorSettings: {
    acceptableHostIdleTime: 0,
    feedbackRule: "",
    futureHostFraction: 0,
    hostsOverallocatedRule: "",
    maximumHosts: 0,
    minimumHosts: 0,
    roundingRule: "",
    version: "utilization",
  },
  iceCreamSettings: {
    configPath: "",
    schedulerHost: "",
  },
  isCluster: false,
  isVirtualWorkStation: false,
  name: "rhel71-power8-large",
  note: "distro note",
  plannerSettings: {
    commitQueueFactor: 0,
    expectedRuntimeFactor: 0,
    generateTaskFactor: 5,
    groupVersions: false,
    mainlineTimeInQueueFactor: 0,
    patchFactor: 0,
    patchTimeInQueueFactor: 0,
    targetTime: 0,
    version: PlannerVersion.Tunable,
  },
  provider: "static",
  providerSettingsList: [
    {
      ami: "who-ami",
      instance_type: "m4.4xlarge",
      is_vpc: true,
      region: "us-east-1",
      security_group_ids: ["1"],
      subnet_id: "subnet-123",
    },
    {
      ami: "who-ami-2",
      instance_type: "m4.2xlarge",
      is_vpc: false,
      region: "us-west-1",
      security_group_ids: ["2"],
    },
  ],
  setup: "ls -alF",
  setupAsSudo: true,
  sshKey: "fakeSshKey",
  sshOptions: ["BatchMode=yes", "ConnectTimeout=10"],
  user: "admin",
  userSpawnAllowed: false,
  validProjects: [],
  workDir: "/data/evg",
};

export { distroData };
