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
    allocation: hostAllocatorSettings,
  };
}) satisfies GqlToFormFunction<Tab>;

export const formToGql = (({ allocation, setup, sshConfig }, distro) => ({
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
    method: setup.bootstrapMethod,
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
  hostAllocatorSettings: allocation,
  setup: setup.setupScript,
  setupAsSudo: setup.setupAsSudo,
  sshKey: sshConfig.sshKey,
  sshOptions: sshConfig.sshOptions,
  user: sshConfig.user,
  workDir: setup.workDir,
})) satisfies FormToGqlFunction<Tab>;
