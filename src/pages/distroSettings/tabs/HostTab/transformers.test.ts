import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  DistroInput,
  FeedbackRule,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { HostFormState } from "./types";

describe("host tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, distroData)).toStrictEqual(gql);
  });

  it("correctly converts from GQL to a form when mountpoints is null", () => {
    expect(gqlToForm({ ...distroData, mountpoints: null })).toStrictEqual({
      ...form,
      setup: { ...form.setup, mountpoints: [] },
    });
  });
});

const form: HostFormState = {
  setup: {
    bootstrapMethod: BootstrapMethod.LegacySsh,
    communicationMethod: CommunicationMethod.LegacySsh,
    arch: Arch.Linux_64Bit,
    workDir: "/data/evg",
    setupScript: "ls -alF",
    setupAsSudo: true,
    userSpawnAllowed: false,
    rootDir: "",
    isVirtualWorkStation: false,
    icecreamSchedulerHost: "",
    icecreamConfigPath: "",
    mountpoints: ["/"],
  },
  bootstrapSettings: {
    jasperBinaryDir: "/home/evg/jasper",
    jasperCredentialsPath: "/home/evg/jasper/creds.json",
    clientDir: "/home/evg/client",
    shellPath: "/bin/bash",
    serviceUser: "",
    homeVolumeFormatCommand: "",
    resourceLimits: {
      lockedMemoryKb: -1,
      numFiles: 64000,
      numProcesses: -1,
      numTasks: 0,
      virtualMemoryKb: -1,
    },
    env: [
      {
        key: "foo",
        value: "bar",
      },
    ],
    preconditionScripts: [],
  },
  sshConfig: {
    user: "admin",
    sshKey: "fakeSshKey",
    authorizedKeysFile: "",
    sshOptions: ["BatchMode=yes", "ConnectTimeout=10"],
  },
  allocation: {
    version: HostAllocatorVersion.Utilization,
    roundingRule: RoundingRule.Default,
    feedbackRule: FeedbackRule.Default,
    hostsOverallocatedRule: OverallocatedRule.Default,
    minimumHosts: 0,
    maximumHosts: 0,
    acceptableHostIdleTime: 0,
    futureHostFraction: 0,
  },
};

const gql: DistroInput = distroData;
