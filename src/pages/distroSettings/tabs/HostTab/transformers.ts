import { DistroSettingsTabRoutes } from "constants/routes";
import { FormToGqlFunction, GqlToFormFunction } from "../types";

type Tab = DistroSettingsTabRoutes.Host;

export const gqlToForm = ((data) => {
  if (!data) return null;

  const {
    arch,
    authorizedKeysFile,
    bootstrapSettings: { communication, method },
    hostAllocatorSettings,
    setup,
    setupAsSudo,
    sshKey,
    sshOptions,
    user,
    workDir,
  } = data;

  return {
    setup: {
      bootstrapMethod: method,
      communicationMethod: communication,
      arch,
      workDir,
      setupScript: setup,
      setupAsSudo,
    },
    sshConfig: {
      user,
      sshKey,
      authorizedKeysFile,
      sshOptions,
    },
    allocation: {
      version: hostAllocatorSettings.version,
      roundingRule: hostAllocatorSettings.roundingRule,
      feedbackRule: hostAllocatorSettings.feedbackRule,
      hostsOverallocatedRule: hostAllocatorSettings.hostsOverallocatedRule,
      minimumHosts: hostAllocatorSettings.minimumHosts,
      maximumHosts: hostAllocatorSettings.maximumHosts,
      acceptableHostIdleTime: hostAllocatorSettings.acceptableHostIdleTime,
      futureHostFraction: hostAllocatorSettings.futureHostFraction,
    },
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ allocation, setup, sshConfig }, distro) => {
  const { bootstrapMethod } = setup;

  return {
    ...distro,
    arch: setup.arch,
    authorizedKeysFile: sshConfig.authorizedKeysFile,
    bootstrapSettings: {
      // TODO: Set fields when they've been added to the form state.
      clientDir: "",
      communication: setup.communicationMethod,
      env: [],
      jasperBinaryDir: "",
      jasperCredentialsPath: "",
      method: bootstrapMethod,
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
    hostAllocatorSettings: {
      acceptableHostIdleTime: allocation.acceptableHostIdleTime,
      feedbackRule: allocation.feedbackRule,
      futureHostFraction: allocation.futureHostFraction,
      hostsOverallocatedRule: allocation.hostsOverallocatedRule,
      maximumHosts: allocation.maximumHosts,
      minimumHosts: allocation.minimumHosts,
      roundingRule: allocation.roundingRule,
      version: allocation.version,
    },
    setup: setup.setupScript,
    setupAsSudo: setup.setupAsSudo,
    sshKey: sshConfig.sshKey,
    sshOptions: sshConfig.sshOptions,
    user: sshConfig.user,
    workDir: setup.workDir,
  };
}) satisfies FormToGqlFunction<Tab>;
