import Code from "@leafygreen-ui/code";
import { Accordion } from "components/Accordion";
import { ShortenedRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { HostEventLogData } from "gql/generated/types";
import { HostEvent, HostMonitorOp } from "types/host";
import { string } from "utils";

const { stringifyNanoseconds } = string;

const getTerminationString = (monitorOp: string) => {
  switch (monitorOp) {
    case HostMonitorOp.Decommissioned:
      return `host was decommissioned.`;
    case HostMonitorOp.Idle:
      return `host was idle.`;
    case HostMonitorOp.Excess:
      return `pool exceeded maximum hosts limit.`;
    case HostMonitorOp.ProvisionTimeout:
      return `host took too long for provisioning to complete.`;
    case HostMonitorOp.ProvisionFailed:
      return `provisioning failed.`;
    case HostMonitorOp.Expired:
      return `expiration time passed.`;
    default:
      return `${monitorOp}`;
  }
};

interface TaskLinkProps {
  "data-cy": string;
  taskId: string;
}
const TaskLink: React.FC<TaskLinkProps> = ({ "data-cy": dataCy, taskId }) => (
  <ShortenedRouterLink
    data-cy={dataCy}
    title={taskId}
    to={getTaskRoute(taskId)}
  >
    {taskId}
  </ShortenedRouterLink>
);

interface HostEventStringProps {
  eventType: string;
  data: HostEventLogData;
}
export const HostEventString: React.FC<HostEventStringProps> = ({
  data,
  eventType,
}) => {
  const succeededString = "succeeded";
  const failedString = "failed";

  switch (eventType) {
    case HostEvent.Created:
      return (
        <div data-cy="created">
          Host creation {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog title="Additional details" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.AgentDeployFailed:
      return <span data-cy="agent-deploy-failed">New agent deploy failed</span>;
    case HostEvent.ProvisionError:
      return (
        <span data-cy="provision-error">
          Host encountered error during provisioning
        </span>
      );
    case HostEvent.Started:
      return (
        <div data-cy="started">
          Host start attempt {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog title="Additional details" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.Stopped:
      return (
        <div data-cy="stopped">
          Host stop attempt {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog title="Additional details" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.Modified:
      return (
        <div data-cy="modified">
          Host modify attempt {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog title="Additional details" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.Fallback:
      return (
        <span data-cy="fallback">
          Host start attempt failed, attempting to fallback to EC2 On-Demand
        </span>
      );
    case HostEvent.AgentDeployed:
      return (
        <div data-cy="agent-deployed">
          Agent deployed {data.agentRevision ? "with revision" : ""}{" "}
          <b>{data.agentRevision}</b> {data.agentBuild ? " from " : ""}
          <b>{data.agentBuild}</b>
        </div>
      );
    case HostEvent.AgentMonitorDeployed:
      return (
        <div data-cy="agent-monitor-deployed">
          Agent monitor deployed {data.agentRevision ? "with revision" : ""}{" "}
          <b>{data.agentRevision}</b>
        </div>
      );
    case HostEvent.AgentMonitorDeployFailed:
      return (
        <span data-cy="agent-monitor-deploy-failed">
          New agent monitor deploy failed
        </span>
      );
    case HostEvent.HostJasperRestarting:
      return (
        <div data-cy="host-jasper-restarting">
          Jasper service marked as restarting {data.user ? "by" : ""}{" "}
          <b>{data.user}</b>
        </div>
      );
    case HostEvent.HostJasperRestarted:
      return (
        <div data-cy="host-jasper-restarted">
          Jasper service restarted with revision <b>{data.jasperRevision}</b>
        </div>
      );
    case HostEvent.HostJasperRestartError:
      return (
        <div data-cy="host-jasper-restart-error">
          Host encountered error when restarting Jasper service
          {data.logs && (
            <HostEventLog title="Provisioning logs" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.HostConvertingProvisioning:
      return (
        <span data-cy="host-converting-provisioning">
          Host converting provisioning type
          {data.provisioningMethod ? " to" : ""} {data.provisioningMethod}
          {data.provisioningMethod ? " method" : ""}
        </span>
      );
    case HostEvent.HostConvertedProvisioning:
      return (
        <span data-cy="host-converted-provisioning">
          Host successfully converted provisioning type
          {data.provisioningMethod ? " to" : ""} {data.provisioningMethod}
          {data.provisioningMethod ? " method" : ""}
        </span>
      );
    case HostEvent.HostConvertingProvisioningError:
      return (
        <div data-cy="host-converting-provisioning-error">
          Host encountered error when converting reprovisioning
          {data.logs && (
            <HostEventLog title="Provisioning logs" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.HostStatusChanged:
      return (
        <div data-cy="host-status-changed">
          Status changed from <b>{data.oldStatus}</b> to <b>{data.newStatus}</b>{" "}
          {data.user ? "by" : ""} <b>{data.user}</b>{" "}
          {data.logs && (
            <HostEventLog
              title="Additional details"
              logs={data.logs}
              isCode={false}
            />
          )}
        </div>
      );
    case HostEvent.HostDNSNameSet:
      return (
        <div data-cy="host-dns-name-set">
          DNS Name set to <b>{data.hostname}</b>
        </div>
      );
    case HostEvent.HostScriptExecuted:
      return (
        <div data-cy="host-script-executed">
          Executed script on host
          {data.logs && (
            <HostEventLog title="Script logs" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.HostScriptExecuteFailed:
      return (
        <div data-cy="host-script-execute-failed">
          Failed to execute script on host
          {data.logs && (
            <HostEventLog title="Script logs" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.HostProvisioned:
      return (
        <div data-cy="host-provisioned">
          Marked as <b>provisioned</b>
        </div>
      );
    case HostEvent.HostRunningTaskSet:
      return (
        <div data-cy="host-running-task-set">
          Assigned to run task{" "}
          <TaskLink taskId={data.taskId} data-cy="host-running-task-set-link" />
        </div>
      );
    case HostEvent.HostRunningTaskCleared:
      return (
        <div data-cy="host-running-task-cleared">
          Current running task cleared (was:{" "}
          <TaskLink
            taskId={data.taskId}
            data-cy="host-running-task-cleared-link"
          />
        </div>
      );
    case HostEvent.HostMonitorFlag:
      return (
        <div data-cy="host-monitor-flag">
          Flagged for termination because:{" "}
          <b>{getTerminationString(data.monitorOp)}</b>
        </div>
      );
    case HostEvent.HostProvisionFailed:
      return (
        <div data-cy="host-provision-failed">
          Provisioning failed{" "}
          {data.logs && (
            <HostEventLog title="Provisioning logs" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.HostTeardown:
      return (
        <div data-cy="host-teardown">
          Teardown script {data.successful ? "ran successfully" : <b>failed</b>}{" "}
          in {stringifyNanoseconds(data.duration, true, true)}
          {data.logs && (
            <HostEventLog title="Teardown logs" logs={data.logs} isCode />
          )}
        </div>
      );
    case HostEvent.HostTaskFinished:
      return (
        <div data-cy="host-task-finished">
          Task{" "}
          <TaskLink taskId={data.taskId} data-cy="host-task-finished-link" />{" "}
          completed with status:
          <b> {data.taskStatus}</b>
        </div>
      );
    case HostEvent.HostExpirationWarningSet:
      return (
        <span data-cy="host-expiration-warning-set">
          Expiration warning sent
        </span>
      );
    case HostEvent.VolumeMigrationFailed:
      return (
        <span data-cy="host-volume-migration-failed">
          Home volume failed to migrate to new host.
          {data.logs && (
            <HostEventLog
              title="Volume migration logs"
              logs={data.logs}
              isCode
            />
          )}
        </span>
      );
    case HostEvent.HostCreatedError:
      return (
        <span data-cy="host-creation-failed">
          Host creation failed.
          {data.logs && (
            <HostEventLog title="Host creation logs" logs={data.logs} isCode />
          )}
        </span>
      );
    default:
      return <span>{eventType}</span>;
  }
};

export const HostEventLog: React.FC<{
  title: string;
  logs: string;
  isCode: boolean;
}> = ({ isCode, logs, title }) => (
  <Accordion data-cy="host-event-log" title={title}>
    <span data-cy="host-event-log-content">
      {isCode ? <Code language="shell">{logs}</Code> : logs}
    </span>
  </Accordion>
);
