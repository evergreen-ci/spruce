import { Button, Grid, Typography } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import { UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  id: string
  logText: string
}

class Props {
  public client: rest.Evergreen;
  public version: UIVersion;
}

export class LogContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      id: this.props.version.Version.builds[0],
      logText: "",
    };
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
          <Button className="log-button" onClick={this.onButtonClick}>All Logs</Button>
          <Button className="log-button" onClick={this.onButtonClick}>Task Logs</Button>
          <Button className="log-button" onClick={this.onButtonClick}>Agent Logs</Button>
          <Button className="log-button" onClick={this.onButtonClick}>System Logs</Button>
          <Button className="log-button" onClick={this.onButtonClick}>Event Logs</Button>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>{this.state.logText}</Typography>
        </Grid>
      </Grid>
    );
  }

  private onButtonClick = () => {
    this.props.client.getLogs((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        console.log("got error " + err + " with status " + status);
        return;
      } else {
        this.setState({
          logText: resp.body
        });
      }
    }, this.state.id, "ALL");
  }
}

export default LogContainer;