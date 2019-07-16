import { Button, Grid, Typography } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import { APITask } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller'
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  logText: string
}

class Props {
  public client: rest.Evergreen;
  public task: APITask;
}

export class LogContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      logText: ""
    }
  }

  public render() {

    return (
      <Grid container={true} spacing={24} className="log-container">
        <Grid item={true} xs={3}>
          <div className="log-links">
            <FolderIcon />
            <Typography>Open Logs</Typography>
            <Typography>HTML / Raw</Typography>
          </div>
        </Grid>
        <Grid item={true} xs={9} className="log-button-group">
          <Button className="log-button" onClick={this.onAllLogsButtonClick}>All Logs</Button>
          <Button className="log-button" onClick={this.onTaskLogsButtonClick}>Task Logs</Button>
          <Button className="log-button" onClick={this.onAgentLogsButtonClick}>Agent Logs</Button>
          <Button className="log-button" onClick={this.onSystemLogsButtonClick}>System Logs</Button>
        </Grid>
        <Grid item={true} xs={12}>
          <InfiniteScroll loadMore={null} className="log-scrollable">
          {this.state.logText}
          </InfiniteScroll>
        </Grid>
      </Grid>
    );
  }

  private onAllLogsButtonClick = () => {
    this.fetchLogs(this.props.task.logs.all_log);
  }

  private onTaskLogsButtonClick = () => {
    this.fetchLogs(this.props.task.logs.task_log);
  }

  private onAgentLogsButtonClick = () => {
    this.fetchLogs(this.props.task.logs.agent_log);
  }

  private onSystemLogsButtonClick = () => {
    this.fetchLogs(this.props.task.logs.system_log);
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