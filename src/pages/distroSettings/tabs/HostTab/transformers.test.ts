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

describe("provider tab", () => {
  describe("static provider", () => {
    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(distroData)).toStrictEqual(form);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(form, distroData)).toStrictEqual(gql);
    });
  });
});

const form: HostFormState = {
  setup: {
    bootstrapMethod: BootstrapMethod.LegacySsh,
    communicationMethod: CommunicationMethod.LegacySsh,
    arch: Arch.LinuxPpc_64Bit,
    workDir: "/data/evg",
    setupScript: "ls -alF",
    setupAsSudo: true,
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

const gql: DistroInput = {
  ...distroData,
  bootstrapSettings: {
    clientDir: "",
    communication: CommunicationMethod.LegacySsh,
    env: [],
    jasperBinaryDir: "",
    jasperCredentialsPath: "",
    method: BootstrapMethod.LegacySsh,
    preconditionScripts: [],
    resourceLimits: {
      lockedMemoryKb: 0,
      numFiles: 0,
      numProcesses: 0,
      numTasks: 0,
      virtualMemoryKb: 0,
    },
    rootDir: "",
    serviceUser: "",
    shellPath: "",
  },
};
