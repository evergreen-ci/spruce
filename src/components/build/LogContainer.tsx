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
          logText: body,
        });
      }, this.props.task.task_id, "T", this.props.task.execution)
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
            <ToggleButton className="log-button" value="all">All Logs</ToggleButton>
            <ToggleButton className="log-button" value="task">Task Logs</ToggleButton>
            <ToggleButton className="log-button" value="agent">Agent Logs</ToggleButton>
            <ToggleButton className="log-button" value="system">System Logs</ToggleButton>
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
    this.setState({
      logType: newLogType
    });
    switch (newLogType) {
      case "all":
        this.fetchLogs("ALL");
        break;
      case "task":
        this.fetchLogs("T");
        break;
      case "agent":
        this.fetchLogs("E");
        break;
      default:
        this.fetchLogs("S ");
        break;
    }
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
}

export default LogContainer;