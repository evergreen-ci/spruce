import { ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/styles';
import { APITask } from 'evergreen.js/lib/models';
import * as React from 'react';
import '../../styles.css';

const StyledExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: "none"
  }
})(MuiExpansionPanel);

interface State {
  displayName: string
  displayHash: string
  order: string
  isShowingBuildView: boolean
}

class Props {
  public task: APITask
}

export class TaskPanel extends React.Component<Props, State> {

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

    return (
      <Grid item={true} xs={12} key={this.props.task.task_id}>
        <StyledExpansionPanel className="task-panel">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{this.props.task.display_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>No tests to show</Typography>
          </ExpansionPanelDetails>
        </StyledExpansionPanel>
      </Grid>
    );
  }

  private setRedirect = () => {
    this.setState({
      isShowingBuildView: false
    })
  }
}

export default TaskPanel;