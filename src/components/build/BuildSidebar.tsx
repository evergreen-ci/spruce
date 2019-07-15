import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import { APITask, Build } from 'evergreen.js/lib/models';
import * as React from 'react';
import '../../styles.css';

interface State {
  displayName: string
  displayHash: string
  order: string
}

class Props {
  public build: Build
  public tasks: APITask[]
}

export class BuildSidebar extends React.Component<Props, State> {

  /*
  ({
          displayName: nextProps.build.display_name,
          displayHash: nextProps.build.git_hash.substr(0, 8),
          order: nextProps.build.order.toString(),
        }) 
  */

  constructor(props: Props) {
    super(props);
    console.log(this.props.build);
    this.state = {
      displayName: "",
      displayHash: "",
      order: "",
    }
  }

  public render() {

    console.log(this.props.build);

    const tasks = this.props.tasks.map(taskObj => (
      <Grid item={true} xs={12} key={taskObj.task_id}>
        <ExpansionPanel className="task-panel">
          <ExpansionPanelSummary>
            <Typography>{taskObj.display_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>No tests to show</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    ));

    return (
      <Grid container={true} spacing={24} className="sidebar">
        <Grid item={true} xs={12} />
        <Grid item={true} xs={12}>
          <Typography>Patch {this.props.build.order} on base commit {this.props.build.git_hash === undefined ? "" : this.props.build.git_hash.substr(0, 8)}</Typography>
          <Typography>{this.props.build.display_name}</Typography>
        </Grid>
        {tasks}
      </Grid>
    );
  }
}

export default BuildSidebar;