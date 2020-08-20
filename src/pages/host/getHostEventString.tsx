import React from "react";
import { HostEventLogData } from "gql/generated/types";
import styled from "@emotion/styled/macro";
import { stringifyNanoseconds, shortenString } from "utils/string";
import Code from "@leafygreen-ui/code";
import { StyledLink } from "components/styles";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { Collapse } from "antd";
import { HostEvent, HostMonitorOp } from "types/host";

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
  switch (eventType) {
    case HostEvent.Created:
      return `Host created`;
    case HostEvent.AgentDeployFailed:
      return `New agent deploy failed`;
    case HostEvent.ProvisionError:
      return `Host encountered error during provisioning`;
    case HostEvent.Started:
      return `Host start attempt ${data.successful ? "succeeded" : ""}`;
    case HostEvent.Stopped:
      return `Host stop attempt ${data.successful ? "succeeded" : ""}`;
    case HostEvent.Modified:
      return `Host modify attempt ${data.successful ? "succeeded" : ""}`;
    case HostEvent.AgentDeployed:
      return (
        <div>
          {" "}
          Agent deployed {data.agentRevision ? "with revision" : ""}{" "}
          <b>{data.agentRevision}</b> {data.agentBuild ? " from " : ""}
          <b>{data.agentBuild}</b>{" "}
        </div>
      );
    case HostEvent.AgentMonitorDeployed:
      return (
        <div>
          {" "}
          Agent monitor deployed {data.agentRevision
            ? "with revision"
            : ""}{" "}
          <b>{data.agentRevision}</b>{" "}
        </div>
      );
    case HostEvent.AgentMonitorDeployFailed:
      return `New agent monitor deploy failed`;
    case HostEvent.HostJasperRestarting:
      return (
        <div>
          {" "}
          Jasper service marked as restarting {data.user ? "by" : ""}{" "}
          <b>{data.user}</b>{" "}
        </div>
      );
    case HostEvent.HostJasperRestarted:
      return (
        <div>
          {" "}
          Jasper service restarted with revision<b>
            {data.jasperRevision}
          </b>{" "}
        </div>
      );
    case HostEvent.HostJasperRestartError:
      return (
        <div>
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
      return `Host converting provisioning type ${
        data.provisioningMethod ? "to" : ""
      }  ${data.provisioningMethod} ${data.provisioningMethod ? "method" : ""}`;
    case HostEvent.HostConvertedProvisioning:
      return `Host successfully converted provisioning type ${
        data.provisioningMethod ? "to" : ""
      }  ${data.provisioningMethod} ${data.provisioningMethod ? "method" : ""}`;
    case HostEvent.HostConvertingProvisioningError:
      return (
        <div>
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
        <div>
          {" "}
          Status changed from <b>{data.oldStatus}</b> to <b>{data.newStatus}</b>{" "}
          {data.user ? "by" : ""} <b>{data.user}</b>{" "}
          {data.logs ? (
            <HostEventLog
              title="Additional details"
              logs={data.logs}
              isCode={false}
            />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostDNSNameSet:
      return (
        <div>
          {" "}
          DNS Name set to <b>${data.hostname}</b>{" "}
        </div>
      );
    case HostEvent.HostScriptExecuted:
      return (
        <div>
          {" "}
          Executed script on host
          {data.logs ? (
            <HostEventLog title="Script Logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostScriptExecuteFailed:
      return (
        <div>
          {" "}
          Failed to execute script on host
          {data.logs ? (
            <HostEventLog title="Script Logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostProvisioned:
      return (
        <div>
          Marked as <b>provisioned</b>
        </div>
      );
    case HostEvent.HostRunningTaskSet:
      return (
        <div>
          {" "}
          Assigned to run task{" "}
          <StyledLink
            href={`${getUiUrl()}/task${data.taskId}/${data.execution}`}
          >
            {shortenString(data.taskId, false, 50, "...")}
          </StyledLink>
        </div>
      );
    case HostEvent.HostRunningTaskCleared:
      return (
        <div>
          {" "}
          Current running task cleared (was:
          <StyledLink
            href={`${getUiUrl()}/task${data.taskId}/${data.execution}`}
          >
            {shortenString(data.taskId, false, 50, "...")}
          </StyledLink>
          )
        </div>
      );
    case HostEvent.HostTaskPIDSet:
      return (
        <div>
          {" "}
          PID of running task set to <b>{data.taskPid}</b>{" "}
        </div>
      );
    case HostEvent.HostMonitorFlag:
      return (
        <div>
          {" "}
          Flagged for termination because:{" "}
          <b>{getTerminationString(data.monitorOp)}</b>
        </div>
      );
    case HostEvent.HostProvisionFailed:
      return (
        <div>
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
        <div>
          {" "}
          Teardown script{" "}
          {data.successful ? (
            <div>ran successfully</div>
          ) : (
            <b>failed</b>
          )} in {stringifyNanoseconds(data.duration, true, true)}
          {data.logs ? (
            <HostEventLog title="Teardown logs" logs={data.logs} isCode />
          ) : (
            ""
          )}
        </div>
      );
    case HostEvent.HostTaskFinished:
      return (
        <div>
          {" "}
          Task{" "}
          <StyledLink
            href={`${getUiUrl()}/task${data.taskId}/${data.execution}`}
          >
            {shortenString(data.taskId, false, 50, "...")}
          </StyledLink>{" "}
          completed with status:
          <b> {data.taskStatus}</b>{" "}
        </div>
      );
    case HostEvent.HostExpirationWarningSet:
      return "Expiration warning sent";
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

export const HostEventLog: React.FC<{
  title: string;
  logs: any;
  isCode: boolean;
}> = ({ title, logs, isCode }) => (
  <StyledCollapse bordered={false}>
    <Panel header={title} key="1">
      {{ isCode } ? (
        <Code multiline={false} language="shell">
          {logs}
        </Code>
      ) : (
        { logs }
      )}
    </Panel>
  </StyledCollapse>
);
