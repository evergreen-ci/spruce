import React from "react";
import { HostEventLogData } from "gql/generated/types";
import styled from "@emotion/styled/macro";
import { stringifyNanoseconds } from "utils/string";
import Code from "@leafygreen-ui/code";
import { StyledLink } from "components/styles";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { Collapse } from "antd";
const { Panel } = Collapse;

const getTerminationString = (monitorOp: string) => {
  switch (monitorOp) {
    case `decommissioned`:
      return `host was decommissioned.`;
    case `idle`:
      return `host was idle.`;
    case `excess`:
      return `host was decommissioned.`;
    case `provision_timeout`:
      return `host took too long for provisioning to complete.`;
    case `provision_failed`:
      return `provisioning failed.`;
    case `expired`:
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
    case `HOST_CREATED`:
      return `Host created`;
    case `HOST_AGENT_DEPLOY_FAILED`:
      return `New agent deploy failed`;
    case `HOST_PROVISION_ERROR`:
      return `Host encountered error during provisioning`;
    case `HOST_STARTED`:
      return `Host start attempt ${data.successful ? "succeeded" : ""}`;
    case `HOST_STOPPED`:
      return `Host stop attempt ${data.successful ? "succeeded" : ""}`;
    case `HOST_MODIFIED`:
      return `Host modify attempt ${data.successful ? "succeeded" : ""}`;
    case `HOST_AGENT_DEPLOYED`:
      return (
        <div>
          {" "}
          Agent deployed with revision <b>{data.agentRevision}</b> from{" "}
          <b>{data.agentBuild}</b>{" "}
        </div>
      );
    case `HOST_AGENT_MONITOR_DEPLOYED`:
      return (
        <div>
          {" "}
          Agent monitor deployed with revision <b>{data.agentRevision}</b>{" "}
        </div>
      );
    case `HOST_AGENT_MONITOR_DEPLOY_FAILED`:
      return `New agent monitor deploy failed`;
    case `HOST_JASPER_RESTARTING`:
      return (
        <div>
          {" "}
          Jasper service marked as restarting {data.user ? "by" : ""}{" "}
          <b>{data.user}</b>{" "}
        </div>
      );
    case `HOST_JASPER_RESTARTED`:
      return (
        <div>
          {" "}
          Jasper service restarted with revision<b>
            {data.jasperRevision}
          </b>{" "}
        </div>
      );
    case `HOST_JASPER_RESTART_ERROR`:
      return (
        <div>
          {" "}
          Host encountered error when restarting Jasper service
          {data.logs ? (
            <StyledCollapse bordered={false}>
              <Panel header="Provisioning logs" key="1">
                <Code showLineNumbers multiline={false} language="shell">
                  {data.logs}
                </Code>
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );

    case `HOST_CONVERTING_PROVISIONING`:
      return `Host converting provisioning type to ${data.provisioningMethod} method`;
    case `HOST_CONVERTED_PROVISIONING`:
      return `Host successfully converted provisioning type to ${data.provisioningMethod} method`;
    case `HOST_CONVERTING_PROVISIONING_ERROR`:
      return (
        <div>
          Host encountered error when converting reprovisioning
          {data.logs ? (
            <StyledCollapse bordered={false}>
              <Panel header="Provisioning logs" key="1">
                <Code showLineNumbers multiline={false} language="shell">
                  {data.logs}
                </Code>
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );
    case `HOST_STATUS_CHANGED`:
      return (
        <div>
          {" "}
          Status changed from <b>{data.oldStatus}</b> to <b>{data.newStatus}</b>{" "}
          {data.user ? "by" : ""} <b>{data.user}</b>{" "}
          {data.logs ? (
            <StyledCollapse bordered={false}>
              <Panel header="Additional details" key="1">
                {data.logs}
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );
    case `HOST_DNS_NAME_SET`:
      return (
        <div>
          {" "}
          DNS Name set to <b>${data.hostname}</b>{" "}
        </div>
      );
    case `HOST_SCRIPT_EXECUTED`:
      return (
        <div>
          {" "}
          Executed script on host
          {data.logs ? (
            <StyledCollapse bordered={false}>
              <Panel header="Script Logs" key="1">
                {data.logs}
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );
    case `HOST_SCRIPT_EXECUTE_FAILED`:
      return (
        <div>
          {" "}
          Failed to execute script on host
          {data.logs ? (
            <StyledCollapse bordered={false}>
              <Panel header="Script Logs" key="1">
                {data.logs}
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );
    case `HOST_PROVISIONED`:
      return (
        <div>
          Marked as <b>provisioned</b>
        </div>
      );
    case `HOST_RUNNING_TASK_SET`:
      return (
        <div>
          {" "}
          Assigned to run task{" "}
          <StyledLink
            href={`${getUiUrl()}/task${data.taskId}/${data.execution}`}
          >
            {data.taskId}
          </StyledLink>
        </div>
      );
    case `HOST_RUNNING_TASK_CLEARED`:
      return (
        <div>
          {" "}
          Current running task cleared (was:
          <StyledLink
            href={`${getUiUrl()}/task${data.taskId}/${data.execution}`}
          >
            {data.taskId}
          </StyledLink>
        </div>
      );
    case `HOST_TASK_PID_SET`:
      return (
        <div>
          {" "}
          PID of running task set to <b>{data.taskPid}</b>{" "}
        </div>
      );
    case `HOST_MONITOR_FLAG`:
      return (
        <div>
          {" "}
          Flagged for termination because:{" "}
          <b>{getTerminationString(data.monitorOp)}</b>
        </div>
      );
    case `HOST_PROVISION_FAILED`:
      return (
        <div>
          {" "}
          Provisioning failed{" "}
          {data.logs ? (
            <StyledCollapse bordered={false}>
              <Panel header="Provisioning logs" key="1">
                <Code showLineNumbers multiline={false} language="shell">
                  {data.logs}
                </Code>
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );
    case `HOST_TEARDOWN`:
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
            <StyledCollapse bordered={false}>
              <Panel header="Teardown logs" key="1">
                <Code showLineNumbers multiline={false} language="shell">
                  {data.logs}
                </Code>
              </Panel>
            </StyledCollapse>
          ) : (
            ""
          )}
        </div>
      );
    case `HOST_TASK_FINISHED`:
      return (
        <div>
          {" "}
          Task{" "}
          <StyledLink
            href={`${getUiUrl()}/task${data.taskId}/${data.execution}`}
          >
            {data.taskId}
          </StyledLink>
          completed with status:
          <b> {data.taskStatus}</b> c{" "}
        </div>
      );
    case `HOST_EXPIRATION_WARNING_SENT`:
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
