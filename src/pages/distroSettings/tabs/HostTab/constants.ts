import {
  Arch,
  BootstrapMethod,
  CommunicationMethod,
  FeedbackRule,
  HostAllocatorVersion,
  OverallocatedRule,
  RoundingRule,
} from "gql/generated/types";

export const linuxArchitectures = [
  Arch.Linux_64Bit,
  Arch.LinuxArm_64Bit,
  Arch.LinuxPpc_64Bit,
  Arch.LinuxZseries,
];

export const nonLinuxArchitectures = Object.values(Arch).filter(
  (a) => !linuxArchitectures.includes(a),
);

export const windowsArchitectures = [Arch.Windows_64Bit];

export const nonWindowsArchitectures = Object.values(Arch).filter(
  (a) => !windowsArchitectures.includes(a),
);

export const architectureToCopy = {
  [Arch.Linux_64Bit]: "Linux 64-bit",
  [Arch.LinuxArm_64Bit]: "Linux ARM 64-bit",
  [Arch.LinuxPpc_64Bit]: "Linux PowerPC 64-bit",
  [Arch.LinuxZseries]: "Linux zSeries",
  [Arch.Osx_64Bit]: "macOS 64-bit",
  [Arch.OsxArm_64Bit]: "macOS ARM 64-bit",
  [Arch.Windows_64Bit]: "Windows 64-bit",
};

export const bootstrapMethodToCopy = {
  [BootstrapMethod.LegacySsh]: "Legacy SSH",
  [BootstrapMethod.Ssh]: "SSH",
  [BootstrapMethod.UserData]: "User Data",
};

export const communicationMethodToCopy = {
  [CommunicationMethod.LegacySsh]: "Legacy SSH",
  [CommunicationMethod.Ssh]: "SSH",
  [CommunicationMethod.Rpc]: "RPC",
};

export const feedbackRuleToCopy = {
  [FeedbackRule.Default]: "Default",
  [FeedbackRule.NoFeedback]: "No feedback",
  [FeedbackRule.WaitsOverThresh]: "Wait over threshold",
};

export const hostAllocatorVersionToCopy = {
  [HostAllocatorVersion.Utilization]: "Utilization",
};

export const overallocatedRuleToCopy = {
  [OverallocatedRule.Default]: "Default",
  [OverallocatedRule.Ignore]: "No terminations when overallocated",
  [OverallocatedRule.Terminate]: "Terminate hosts when overallocated",
};

export const roundingRuleToCopy = {
  [RoundingRule.Default]: "Default",
  [RoundingRule.Down]: "Round down",
  [RoundingRule.Up]: "Round up",
};
