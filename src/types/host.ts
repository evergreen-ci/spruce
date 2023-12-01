import { HostsQueryVariables, HostSortBy } from "gql/generated/types";
import { PartialRecord } from "types/utils";

export enum HostStatus {
  // green: host-running
  Running = "running",

  // yellow: host-starting
  Starting = "starting",
  Provisioning = "provisioning",

  // red: host-terminated
  Terminated = "terminated",

  // grey: host-unreachable
  Decommissioned = "decommissioned",
  Quarantined = "quarantined",
  ProvisionFailed = "provision failed",

  // sometimes shows not found error on old UI
  Uninitialized = "initializing",
  Building = "building",

  // doesn't show up on the hosts page
  Success = "success",
  Stopping = "stopping",
  Stopped = "stopped",
  Failed = "failed",
  ExternalUserName = "external",
}

export enum UpdateHostStatus {
  Running = "running",
  Quarantined = "quarantined",
  Decommissioned = "decommissioned",
  Terminated = "terminated",
  Stopped = "stopped",
}

export enum HostEvent {
  Created = "HOST_CREATED",
  AgentDeployFailed = "HOST_AGENT_DEPLOY_FAILED",
  ProvisionError = "HOST_PROVISION_ERROR",
  Started = "HOST_STARTED",
  Stopped = "HOST_STOPPED",
  Modified = "HOST_MODIFIED",
  Fallback = "HOST_FALLBACK",
  AgentDeployed = "HOST_AGENT_DEPLOYED",
  AgentMonitorDeployed = "HOST_AGENT_MONITOR_DEPLOYED",
  HostJasperRestarting = "HOST_JASPER_RESTARTING",
  AgentMonitorDeployFailed = "HOST_AGENT_MONITOR_DEPLOY_FAILED",
  HostJasperRestarted = "HOST_JASPER_RESTARTED",
  HostJasperRestartError = "HOST_JASPER_RESTART_ERROR",
  HostConvertingProvisioning = "HOST_CONVERTING_PROVISIONING",
  HostConvertedProvisioning = "HOST_CONVERTED_PROVISIONING",
  HostConvertingProvisioningError = "HOST_CONVERTING_PROVISIONING_ERROR",
  HostStatusChanged = "HOST_STATUS_CHANGED",
  HostDNSNameSet = "HOST_DNS_NAME_SET",
  HostScriptExecuted = "HOST_SCRIPT_EXECUTED",
  HostScriptExecuteFailed = "HOST_SCRIPT_EXECUTE_FAILED",
  HostProvisioned = "HOST_PROVISIONED",
  HostRunningTaskSet = "HOST_RUNNING_TASK_SET",
  HostRunningTaskCleared = "HOST_RUNNING_TASK_CLEARED",
  HostMonitorFlag = "HOST_MONITOR_FLAG",
  HostProvisionFailed = "HOST_PROVISION_FAILED",
  HostTeardown = "HOST_TEARDOWN",
  HostTaskFinished = "HOST_TASK_FINISHED",
  HostExpirationWarningSet = "HOST_EXPIRATION_WARNING_SENT",
  VolumeMigrationFailed = "VOLUME_MIGRATION_FAILED",
}

export enum HostMonitorOp {
  Decommissioned = "decommissioned",
  Idle = "idle",
  Excess = "excess",
  ProvisionTimeout = "provision_timeout",
  ProvisionFailed = "provision_failed",
  Expired = "expired",
}

export enum HostsTableFilterParams {
  CurrentTaskId = "currentTaskId",
  DistroId = "distroId",
  HostId = "hostId",
  StartedBy = "startedBy",
  Statuses = "statuses",
}

export const mapQueryParamToId: Record<HostsTableFilterParams, HostSortBy> = {
  [HostsTableFilterParams.HostId]: HostSortBy.Id,
  [HostsTableFilterParams.DistroId]: HostSortBy.Distro,
  [HostsTableFilterParams.Statuses]: HostSortBy.Status,
  [HostsTableFilterParams.CurrentTaskId]: HostSortBy.CurrentTask,
  [HostsTableFilterParams.StartedBy]: HostSortBy.Owner,
} as const;

export const mapIdToFilterParam: PartialRecord<
  HostSortBy,
  keyof HostsQueryVariables
> = Object.entries(mapQueryParamToId).reduce(
  (accum, [id, param]) => ({
    ...accum,
    [param]: id,
  }),
  {}
);
