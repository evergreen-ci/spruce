import { Button, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { APITask, Build } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import '../../styles.css';

interface State {
  displayName: string
  displayHash: string
  order: string
  isShowingBuildView: boolean
}

class Props {
  public build: Build
  public tasks: APITask[]
}

export class BuildSidebar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      displayName: "",
      displayHash: "",
      order: "",
      isShowingBuildView: true
    }
  }

  public render() {

    if (!this.state.isShowingBuildView) {
      return <Redirect to={"/patches"}/>
    }

    const tasks = this.props.tasks.map(taskObj => (
      <Grid item={true} xs={12} key={taskObj.task_id}>
        <ExpansionPanel className="task-panel">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{taskObj.display_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>No tests to show</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    ));

    return (
      <Grid container={true} spacing={2} className="sidebar">
        <Grid item={true} xs={12} />
        <Grid item={true} xs={12}>
          <Button onClick={this.setRedirect}>
            <ArrowLeftIcon />
            My Patches
          </Button>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>Patch {this.props.build.order} on base commit {this.props.build.git_hash === undefined ? "" : this.props.build.git_hash.substr(0, 8)}</Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>{this.props.build.display_name}</Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>Created on {moment(String(this.props.build.create_time)).format("LLLL")}</Typography>
        </Grid>
        {tasks}
      </Grid>
    );
  }

  private setRedirect = () => {
    this.setState({
      isShowingBuildView: false
    })
  }
}

export default BuildSidebar;