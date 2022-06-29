import React from "react";
import styled from "@emotion/styled";
import Code from "@leafygreen-ui/code";
import { Collapse } from "antd";
import { StyledRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { HostEventLogData } from "gql/generated/types";
import { HostEvent, HostMonitorOp } from "types/host";
import { string } from "utils";

const { stringifyNanoseconds, shortenString } = string;
const { Panel } = Collapse;

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

export const getHostEventString = (
  eventType: string,
  data: HostEventLogData
) => {
  const succeededString = "succeeded";
  switch (eventType) {
    case HostEvent.Created:
      return <span data-cy="created">Host created</span>;
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
        <span data-cy="started">
          Host start attempt {data.successful ? succeededString : ""}
        </span>
      );
    case HostEvent.Stopped:
      return (
        <span data-cy="stopped">
          Host stop attempt {data.successful ? succeededString : ""}
        </span>
      );
    case HostEvent.Modified:
      return (
        <span data-cy="modified">
          Host modify attempt {data.successful ? succeededString : ""}
        </span>
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
          {" "}
          Agent deployed {data.agentRevision ? "with revision" : ""}{" "}
          <b>{data.agentRevision}</b> {data.agentBuild ? " from " : ""}
          <b>{data.agentBuild}</b>{" "}
        </div>
      );
    case HostEvent.AgentMonitorDeployed:
      return (
        <div data-cy="agent-monitor-deployed">
          {" "}
          Agent monitor deployed {data.agentRevision
            ? "with revision"
            : ""}{" "}
          <b>{data.agentRevision}</b>{" "}
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
          {" "}
          Jasper service marked as restarting {data.user ? "by" : ""}{" "}
          <b>{data.user}</b>{" "}
        </div>
      );
    case HostEvent.HostJasperRestarted:
      return (
        <div data-cy="host-jasper-restarted">
          {" "}
          Jasper service restarted with revision<b>
            {data.jasperRevision}
          </b>{" "}
        </div>
      );
    case HostEvent.HostJasperRestartError:
      return (
        <div data-cy="host-jasper-restart-error">
          {" "}
          Host encountered error when restarting Jasper service
          {data.logs ? (
            <HostEventLog title="Provisioning logs" logs={data.logs} isCode />
          ) : (
            ""
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
          {data.logs ? (
            <HostEventLog title="Provisioning logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostStatusChanged:
      return (
        <div data-cy="host-status-changed">
          {" "}
          Status changed from <b>{data.oldStatus}</b> to <b>{data.newStatus}</b>{" "}
          {data.user ? "by" : ""} <b>{data.user}</b>{" "}
          {data.logs ? (
            <HostEventLog
              title="Additional details"
              logs={data.logs}
              data-cy="host-status-log"
              isCode={false}
            />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostDNSNameSet:
      return (
        <div data-cy="host-dns-name-set">
          {" "}
          DNS Name set to <b>{data.hostname}</b>{" "}
        </div>
      );
    case HostEvent.HostScriptExecuted:
      return (
        <div data-cy="host-script-executed">
          {" "}
          Executed script on host
          {data.logs ? (
            <HostEventLog title="Script logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostScriptExecuteFailed:
      return (
        <div data-cy="host-script-execute-failed">
          {" "}
          Failed to execute script on host
          {data.logs ? (
            <HostEventLog title="Script logs" logs={data.logs} isCode />
          ) : (
            ""
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
          {" "}
          Assigned to run task{" "}
          <StyledRouterLink
            data-cy="host-running-task-set-link"
            to={getTaskRoute(data.taskId)}
          >
            {shortenString(data.taskId, false, 50, "...")}
          </StyledRouterLink>
        </div>
      );
    case HostEvent.HostRunningTaskCleared:
      return (
        <div data-cy="host-running-task-cleared">
          {" "}
          Current running task cleared (was:
          <StyledRouterLink
            data-cy="host-running-task-cleared-link"
            to={getTaskRoute(data.taskId)}
          >
            {shortenString(data.taskId, false, 50, "...")}
          </StyledRouterLink>
          )
        </div>
      );
    case HostEvent.HostMonitorFlag:
      return (
        <div data-cy="host-monitor-flag">
          {" "}
          Flagged for termination because:{" "}
          <b>{getTerminationString(data.monitorOp)}</b>
        </div>
      );
    case HostEvent.HostProvisionFailed:
      return (
        <div data-cy="host-provision-failed">
          {" "}
          Provisioning failed{" "}
          {data.logs ? (
            <HostEventLog title="Provisioning logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostTeardown:
      return (
        <div data-cy="host-teardown">
          {" "}
          Teardown script {data.successful ? (
            "ran successfully"
          ) : (
            <b>failed</b>
          )}{" "}
          in {stringifyNanoseconds(data.duration, true, true)}
          {data.logs ? (
            <HostEventLog title="Teardown logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostTaskFinished:
      return (
        <div data-cy="host-task-finished">
          {" "}
          Task{" "}
          <StyledRouterLink
            data-cy="host-task-finished-link"
            to={getTaskRoute(data.taskId)}
          >
            {shortenString(data.taskId, false, 50, "...")}
          </StyledRouterLink>{" "}
          completed with status:
          <b> {data.taskStatus}</b>{" "}
        </div>
      );
    case HostEvent.HostExpirationWarningSet:
      return (
        <span data-cy="host-expiration-warning-set">
          Expiration warning sent
        </span>
      );
    default:
      return `${eventType}`;
  }
};

export const StyledCollapse = styled(Collapse)`
  background: none;
  width: inherit;
  > * {
    border-bottom: hidden !important;
    width: inherit;
  }
`;

export const HostEventLog: React.VFC<{
  title: string;
  logs: string;
  isCode: boolean;
  "data-cy"?: string;
}> = ({ title, logs, isCode, "data-cy": dataCy = "host-event-logs-title" }) => (
  <span data-cy="host-event-logs">
    <StyledCollapse bordered={false}>
      <Panel header={<span data-cy={dataCy}>{title}</span>} key="1">
        <span data-cy="host-event-log-content">
          {isCode ? <Code language="shell">{logs}</Code> : logs}
        </span>
      </Panel>
    </StyledCollapse>
  </span>
);
