import { Grid, Typography } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { APITask } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller'
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  logText: string
  logType: string
}

class Props {
  public client: rest.Evergreen;
  public task: APITask;
}

export class LogContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      logText: "",
      logType: "task"
    }
  }

  public componentDidUpdate() {
    if (this.props.task.logs !== undefined && this.state.logText === "") {
      this.props.client.getLogs((err, resp, body) => {
        this.setState({
          logText: body
        });
      }, this.props.task.logs.task_log)
    }
  }

  public render() {

    return (
      <Grid container={true} spacing={2} className="log-container">
        <Grid item={true} xs={3}>
          <div className="log-links">
            <FolderIcon />
            <Typography>Open Logs</Typography>
            <Typography>HTML / Raw</Typography>
          </div>
        </Grid>
        <Grid item={true} xs={9} className="log-button-group">
          <ToggleButtonGroup exclusive={true} value={this.state.logType} onChange={this.handleLogChange}>
            <ToggleButton value="all">All Logs</ToggleButton>
            <ToggleButton value="task">Task Logs</ToggleButton>
            <ToggleButton value="agent">Agent Logs</ToggleButton>
            <ToggleButton value="system">System Logs</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item={true} xs={12}>
          <InfiniteScroll loadMore={null} className="log-scrollable">
            {this.state.logText}
          </InfiniteScroll>
        </Grid>
      </Grid>
    );
  }

  private handleLogChange = (event: object, newLogType: string) => {
    console.log(newLogType);
    this.setState({
      logType: newLogType
    });
    switch (newLogType) {
      case "all":
        this.fetchLogs(this.props.task.logs.all_log);
      case "task":
        this.fetchLogs(this.props.task.logs.task_log);
      case "agent":
        this.fetchLogs(this.props.task.logs.agent_log);
      default:
        this.fetchLogs(this.props.task.logs.system_log);
    }
  }

  private fetchLogs = (url: string) => {
    this.props.client.getLogs((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        console.log("got error " + err + " with status " + status);
        return;
      } else {
        this.setState({
          logText: body
        });
      }
    }, url);
  }
}

export default LogContainer;