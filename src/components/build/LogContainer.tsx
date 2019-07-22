import { Grid, Link, Typography } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { APITask } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller'
import * as rest from "../../rest/interface";
import '../../styles.css';

export enum LogType {
  all = "ALL",
  task = "T",
  agent = "E",
  system = "S"
};

interface State {
  logText: string
  logType: LogType
  htmlLink: string
  rawLink: string
}

class Props {
  public client: rest.Evergreen;
  public task: APITask;
  public onFinishStateUpdate: () => void;
}

export class LogContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      logText: "",
      logType: LogType.task,
      htmlLink: "",
      rawLink: "",
    }
  }

  public componentDidUpdate() {
    if (this.props.task.logs !== undefined && this.state.logText === "") {
      this.props.client.getLogs((err, resp, body) => {
        this.setState({
          logText: body,
          htmlLink: this.props.task.logs.task_log,
          rawLink: this.props.task.logs.task_log + "&text=true"
        });
      }, this.props.task.task_id, LogType.task, this.props.task.execution)
    }
  }

  public render() {

    // TODO: use Evergreen API to determine the severity of each log line (see example below)
    // (https://evergreen.mongodb.com/json/task_log/spruce_ubuntu1604_lint_37ec5816d14e05bd02535788d114da8b97ed0231_19_07_11_18_09_18/0?type=T)
    const Logs = () => (
      <InfiniteScroll loadMore={this.dummyLoadMore} className="log-scrollable">
        {this.state.logText.split("\n").map(textLine => (
          <Typography className={this.lineContainsError(textLine.toLowerCase()) ? "log-text-error" : "log-text-normal"}>
            {textLine}
          </Typography>
        ))}
      </InfiniteScroll>
    );

    return (
      <Grid container={true} spacing={2} className="log-container">
        <Grid item={true} xs={4} className="log-links">
          <FolderIcon className="log-link-item" />
          <Typography className="log-link-item">Open Logs </Typography>
          <Link className="log-link-item" href={this.state.htmlLink} target="_blank">HTML</Link>
          <Typography className="log-link-item"> / </Typography>
          <Link className="log-link-item" href={this.state.rawLink} target="_blank">Raw</Link>
        </Grid>
        <Grid item={true} xs={8} className="log-button-group">
          <ToggleButtonGroup exclusive={true} value={this.state.logType} onChange={this.handleLogChange}>
            <ToggleButton className="log-button" key="all" value={LogType.all}>All Logs</ToggleButton>
            <ToggleButton className="log-button" key="task" value={LogType.task}>Task Logs</ToggleButton>
            <ToggleButton className="log-button" key="agent" value={LogType.agent}>Agent Logs</ToggleButton>
            <ToggleButton className="log-button" key="system" value={LogType.system}>System Logs</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item={true} xs={12}>
          <Logs />
        </Grid>
      </Grid>
    );
  }

  private dummyLoadMore = () => {
    return;
  }

  private handleLogChange = (event: object, newLogType: LogType) => {
    this.fetchLogs(newLogType);
    this.setState({
      logType: newLogType,
      htmlLink: this.props.client.uiURL + "/task_log_raw/" + this.props.task.task_id + "/" + this.props.task.execution + "?type=" + newLogType,
      rawLink: this.props.client.uiURL + "/task_log_raw/" + this.props.task.task_id + "/" + this.props.task.execution + "?type=" + newLogType + "&text=true"
    }, this.props.onFinishStateUpdate);
  }

  private fetchLogs = (logType: string) => {
    this.props.client.getLogs((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        console.log("got error " + err + " with status " + status);
        return;
      } else {
        this.setState({
          logText: body
        });
      }
    }, this.props.task.task_id, logType, this.props.task.execution);
  }

  private lineContainsError = (logLine: string) => {
    const errorStrings = ["error", "warn", "fail"];
    return errorStrings.some(str => logLine.includes(str));
  }
}

export default LogContainer;