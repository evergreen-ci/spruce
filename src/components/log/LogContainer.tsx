import { Grid, Link, Typography } from '@material-ui/core';
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import axios, { AxiosResponse } from 'axios';
import { APITask, APITest } from 'evergreen.js/lib/models';
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
  taskId: string
  logText: string
  logType: LogType
  htmlLink: string
  rawLink: string
  isShowingTestLogs: boolean
}

class Props {
  public client: rest.Evergreen;
  public task: APITask;
  public test: APITest;
  public onFinishStateUpdate: () => void;
  public shouldShowTestLogs: boolean;
}

export class LogContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      taskId: this.props.task.task_id,
      logText: "",
      logType: LogType.task,
      htmlLink: "",
      rawLink: "",
      isShowingTestLogs: false
    }
  }

  public componentDidMount() {
    if (this.props.task.logs !== undefined && this.state.logText === "") {
      this.props.client.getLogs(this.props.task.task_id, LogType.task, this.props.task.execution)
        .then((resp: AxiosResponse<any>) => {
          this.setState({
            logText: resp.data,
            htmlLink: this.props.task.logs.task_log,
            rawLink: this.props.task.logs.task_log + "&text=true"
          });
        });
    }
  }

  public componentDidUpdate() {
    if ((this.props.task.task_id !== this.state.taskId) || (this.state.isShowingTestLogs && !this.props.shouldShowTestLogs)) {
      this.props.client.getLogs(this.props.task.task_id, LogType.task, this.props.task.execution)
        .then((resp: AxiosResponse<any>) => {
          this.setState({
            taskId: this.props.task.task_id,
            logText: resp.data,
            logType: LogType.task,
            htmlLink: this.props.task.logs.task_log,
            rawLink: this.props.task.logs.task_log + "&text=true",
            isShowingTestLogs: false
          });
        });
    } else if (this.props.shouldShowTestLogs && this.state.rawLink !== this.props.test.logs.url_raw) {
      if (this.props.test.logs.url_raw === "") {
        this.setState({
          logText: "No logs to display for test.",
          logType: LogType.all,
          htmlLink: this.props.test.logs.url,
          rawLink: this.props.test.logs.url_raw,
          isShowingTestLogs: true
        });
      } else {
        axios.get(this.props.test.logs.url_raw).then((resp: AxiosResponse<any>) => {
          this.setState({
            logText: resp.data,
            logType: LogType.all,
            htmlLink: this.props.test.logs.url,
            rawLink: this.props.test.logs.url_raw,
            isShowingTestLogs: true
          });
        });
      }
    }
  }

  public render() {

    const Logs = () => (
      <InfiniteScroll loadMore={this.dummyLoadMore} className="log-scrollable">
        {this.state.logText.split("\n").map((textLine, index) => (
          <Typography className={this.lineContainsError(textLine.toLowerCase()) ? "log-text-error" : "log-text-normal"} key={index}>
            {textLine}
          </Typography>
        ))}
      </InfiniteScroll>
    );

    return (
      <Grid container={true} spacing={2} className="log-container">
        <Grid item={true} xs={4} className="log-links">
          <FolderOutlinedIcon className="log-link-item" />
          <Typography className="log-link-item">Open Logs </Typography>
          <Link className="log-link-item" href={this.state.htmlLink} target="_blank">HTML</Link>
          <Typography className="log-link-item"> / </Typography>
          <Link className="log-link-item" href={this.state.rawLink} target="_blank">Raw</Link>
        </Grid>
        <Grid item={true} xs={8} className="log-button-group">
          <ToggleButtonGroup exclusive={true} value={this.state.logType} onChange={this.handleLogTypeChange}>
            <ToggleButton className="log-button" key="all" value={LogType.all}>All Logs</ToggleButton>
            <ToggleButton className="log-button" key="task" value={LogType.task} disabled={this.state.isShowingTestLogs}>Task Logs</ToggleButton>
            <ToggleButton className="log-button" key="agent" value={LogType.agent} disabled={this.state.isShowingTestLogs}>Agent Logs</ToggleButton>
            <ToggleButton className="log-button" key="system" value={LogType.system} disabled={this.state.isShowingTestLogs}>System Logs</ToggleButton>
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

  private handleLogTypeChange = (event: object, newLogType: LogType) => {
    this.props.client.getLogs(this.props.task.task_id, newLogType, this.props.task.execution)
      .then((resp: AxiosResponse<any>) => {
        this.setState({
          logText: resp.data,
          logType: newLogType,
          htmlLink: this.props.client.uiURL + "/task_log_raw/" + this.props.task.task_id + "/" + this.props.task.execution + "?type=" + newLogType,
          rawLink: this.props.client.uiURL + "/task_log_raw/" + this.props.task.task_id + "/" + this.props.task.execution + "?type=" + newLogType + "&text=true"
        }, this.props.onFinishStateUpdate);
      });
  }

  // TODO: use Evergreen API to determine the severity of each log line (see example below)
  // (https://evergreen.mongodb.com/json/task_log/spruce_ubuntu1604_lint_37ec5816d14e05bd02535788d114da8b97ed0231_19_07_11_18_09_18/0?type=T)
  private lineContainsError = (logLine: string) => {
    const errorStrings = ["error", "warn", "fail"];
    return errorStrings.some(str => logLine.includes(str));
  }
}

export default LogContainer;